'use client';

import { Button } from "@/components/ui/button";

export function AuthButtons() {
  // 后续添加认证状态判断
  const isLoggedIn = false;

  if (isLoggedIn) {
    return (
      <div>
        {/* 用户信息 */}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost">登录</Button>
      <Button>注册</Button>
    </div>
  );
} 