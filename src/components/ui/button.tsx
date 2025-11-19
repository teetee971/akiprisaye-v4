// src/components/ui/button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, className = "", ...props }) => {
  const baseClasses = "px-4 py-2 rounded font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const combinedClasses = `${baseClasses} ${className}`;
  
  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
