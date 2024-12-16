'use client';

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { AuthModal, AuthMode } from "./auth/AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/ui/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AuthButtons() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  
  const handleOpenModal = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsModalOpen(true);
  };

  if (status === "loading") {
    return (
      <Button variant="ghost" disabled>
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        加载中
      </Button>
    );
  }

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
              <AvatarFallback>{session.user.name?.[0] || session.user.email?.[0]}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => signOut()}
          >
            <Icons.logout className="mr-2 h-4 w-4" />
            退出登录
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost"
          onClick={() => handleOpenModal('login')}
        >
          登录
        </Button>
        <Button
          onClick={() => handleOpenModal('register')}
        >
          注册
        </Button>
      </div>

      <AuthModal
        mode={authMode}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onModeSwitch={setAuthMode}
      />
    </>
  );
} 