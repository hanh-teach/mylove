import React from 'react';

type TypographyVariant = 
  | 'display' 
  | 'h1' | 'h2' | 'h3' 
  | 'title' | 'subtitle' 
  | 'body' | 'body-sm' 
  | 'caption' | 'label';

interface TypographyProps {
  variant?: TypographyVariant;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  as: Component = 'p',
  className = '',
  children,
}) => {
  const variants = {
    display: "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight",
    h1: "text-3xl sm:text-4xl font-bold tracking-tight",
    h2: "text-2xl sm:text-3xl font-bold tracking-tight",
    h3: "text-xl sm:text-2xl font-bold tracking-tight",
    title: "text-lg sm:text-xl font-bold tracking-tight",
    subtitle: "text-base sm:text-lg font-semibold text-text-muted",
    body: "text-base leading-relaxed",
    'body-sm': "text-sm leading-relaxed",
    caption: "text-xs font-medium text-text-muted",
    label: "text-[10px] font-bold uppercase tracking-wider text-text-muted"
  };

  return (
    <Component className={`${variants[variant]} ${className}`}>
      {children}
    </Component>
  );
};
