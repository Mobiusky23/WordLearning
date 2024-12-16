'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/components/ui/icons";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

const registerSchema = z.object({
  email: z.string().email({ message: "请输入有效的邮箱地址" }),
  password: z.string()
    .min(6, { message: "密码至少需要6个字符" })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, {
      message: "密码必须包含字母和数字",
    }),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "必须同意用户协议才能注册",
  }),
});

interface RegisterFormProps {
  onModeSwitch: () => void;
  onClose?: () => void;
}

export function RegisterForm({ onModeSwitch, onClose }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      agreeToTerms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "注册失败，请稍后重试"
        }));
        throw new Error(errorData.error || "注册失败");
      }

      const data = await response.json().catch(() => null);
      if (!data) {
        throw new Error("注册失败，请稍后重试");
      }

      setRegistrationStatus('success');
      
      // 自动登录
      const signInResult = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      // 3秒后关闭弹窗
      setTimeout(() => {
        onClose?.();
      }, 500);

    } catch (error) {
      setRegistrationStatus('error');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (registrationStatus === 'success') {
    return (
      <div className="space-y-4 text-center py-4">
        <Icons.check className="w-12 h-12 text-green-500 mx-auto" />
        <h2 className="text-xl font-semibold">注册成功！</h2>
        <p className="text-sm text-muted-foreground">
          已为您自动登录，页面即将关闭...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">创建账号</h2>
        <p className="text-sm text-muted-foreground">
          请填写以下信息完成注册
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input placeholder="请输入邮箱" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="请输入密码" 
                      {...field} 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <div className="text-xs text-muted-foreground mt-2">
                  <ul className="list-disc list-inside space-y-1">
                    <li>密码长度至少6位</li>
                    <li>必须包含字母和数字的组合</li>
                    <li>请避免使用生日、电话号码等个人信息作为密码</li>
                  </ul>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal leading-none">
                  我已阅读并同意
                  <Button variant="link" className="p-0 mx-1">用户协议</Button>
                  和
                  <Button variant="link" className="p-0 mx-1">隐私政策</Button>
                </FormLabel>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            注册
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">已有账号? </span>
        <Button variant="link" className="p-0" onClick={onModeSwitch}>
          立即登录
        </Button>
      </div>
    </div>
  );
} 