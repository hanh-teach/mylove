import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'ghost' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  title,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer selection:bg-transparent";
  
  const variants = {
    primary: "bg-primary text-text-inverse hover:bg-primary-hover shadow-level-1 hover:shadow-level-2 border border-transparent hover:border-white/20",
    secondary: "bg-surface-elevated text-text-main border border-border-base hover:bg-white hover:border-primary hover:shadow-level-2",
    outlined: "bg-transparent border border-primary text-primary hover:bg-primary/5 hover:shadow-level-2",
    ghost: "bg-transparent text-text-muted hover:bg-surface-elevated hover:text-text-main hover:border-border-subtle border border-transparent",
    danger: "bg-rose-500 text-white hover:bg-rose-600 hover:shadow-level-2 shadow-level-1 border border-transparent hover:border-white/20"
  };

  const sizes = {
    xs: "h-8 px-3 text-[10px] rounded-xs gap-1",
    sm: "h-9 px-4 text-xs rounded-sm gap-1.5",
    md: "h-11 px-6 text-sm rounded-md gap-2",
    lg: "h-14 px-8 text-base rounded-lg gap-2.5",
    xl: "h-16 px-10 text-lg rounded-xl gap-3"
  };

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { y: -1 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : {}}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      )}
      {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span className="whitespace-nowrap">{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </motion.button>
  );
};
