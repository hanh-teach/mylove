import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: CardVariant;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isHoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  isHoverable = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = "bg-surface rounded-md transition-all duration-200 overflow-hidden";
  
  const variants = {
    default: "border border-border-base shadow-level-1",
    elevated: "shadow-level-2 border border-border-subtle",
    outlined: "border-2 border-border-base shadow-none",
    flat: "bg-surface-elevated border-none shadow-none"
  };

  const paddings = {
    none: "p-0",
    xs: "p-2",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10"
  };

  return (
    <motion.div
      whileHover={isHoverable ? { y: -4, shadow: "var(--shadow-level-3)" } : {}}
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${isHoverable ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
