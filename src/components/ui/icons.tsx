
import { LucideProps } from "lucide-react";

export const Eye3d = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
    <path d="M12 14c1.66 0 3-1.34 3-3V7c0-1.66-1.34-3-3-3S9 5.34 9 7v4c0 1.66 1.34 3 3 3Z" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <path d="M5 6.5C3.5 5.5 2.5 5.5 1 6.5" />
    <path d="M19 6.5c1.5-1 2.5-1 4 0" />
  </svg>
);
