
import type { HTMLAttributes } from "react";

declare interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
  className?: string;
  children: React.ReactNode;
}

declare interface AppointmentType {
  id: string;
  name: string;
  date: Date;
  time: string;
  description?: string;
  status: "pending" | "confirmed" | "cancelled";
}

declare module "*.jpg";
declare module "*.png";
declare module "*.svg";
declare module "*.mp3";
