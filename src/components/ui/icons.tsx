'use client';

import {
  Loader2,
  Star,
  User,
  LogOut,
  Settings,
  Check,
  type LucideIcon,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  spinner: Loader2,
  star: Star,
  user: User,
  logout: LogOut,
  settings: Settings,
  check: Check,
} as const; 