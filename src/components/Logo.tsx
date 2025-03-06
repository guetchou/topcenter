
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClass = size === "sm" ? "h-6" : size === "lg" ? "h-10" : "h-8";

  return (
    <Link to="/" className={`flex items-center space-x-2 ${className}`}>
      <img
        src="/lovable-uploads/logo-topcenter.png"
        alt="TopCenter Logo"
        className={`${sizeClass} w-auto`}
      />
    </Link>
  );
}
