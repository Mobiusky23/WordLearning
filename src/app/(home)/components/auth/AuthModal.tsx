'use client';

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { cn } from "@/lib/utils";

export type AuthMode = 'login' | 'register';

interface AuthModalProps {
  mode: AuthMode;
  isOpen: boolean;
  onClose: () => void;
  onModeSwitch: (mode: AuthMode) => void;
}

export function AuthModal({ mode, isOpen, onClose, onModeSwitch }: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="sr-only">
          {mode === 'login' ? '登录' : '注册'}
        </DialogTitle>
        {mode === 'login' ? (
          <LoginForm onModeSwitch={() => onModeSwitch('register')} onClose={onClose} />
        ) : (
          <RegisterForm onModeSwitch={() => onModeSwitch('login')} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
} 