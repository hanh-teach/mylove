import React from 'react';
import { Button, ButtonProps } from './Button';
import { Input, InputProps } from './Input';

export interface ToolbarContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const ToolbarContainer: React.FC<ToolbarContainerProps> = ({ children, className = '', ...props }) => (
  <div
    className={`bg-surface/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-level-3 border border-border-subtle flex items-center gap-1.5 select-none text-xs overflow-x-auto max-w-full ${className}`}
    {...props}
  >
    {children}
  </div>
);

export interface ToolbarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hasDivider?: boolean;
  className?: string;
}

export const ToolbarGroup: React.FC<ToolbarGroupProps> = ({
  children,
  hasDivider = false,
  className = '',
  ...props
}) => (
  <div
    className={`flex items-center gap-1 shrink-0 ${hasDivider ? 'border-r border-border-subtle pr-2' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
);

export interface ToolbarButtonProps extends Omit<ButtonProps, 'size'> {
  active?: boolean;
  size?: ButtonProps['size'];
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  active = false,
  variant = 'ghost',
  size = 'sm',
  className = '',
  children,
  ...props
}) => {
  const activeStyles = active ? 'bg-primary/10 text-primary border-primary/30 font-bold' : '';
  return (
    <Button
      variant={variant}
      size={size}
      className={`rounded-xl transition-all ${activeStyles} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactNode;
  active?: boolean;
  label?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  active = false,
  variant = 'ghost',
  size = 'sm',
  className = '',
  title,
  label,
  'aria-label': ariaLabel,
  ...props
}) => {
  const activeStyles = active ? 'bg-surface-elevated text-text-main font-bold' : '';
  return (
    <Button
      variant={variant}
      size={size}
      title={title}
      aria-label={ariaLabel || title || label}
      className={`p-2 rounded-xl h-auto w-auto aspect-square justify-center ${activeStyles} ${className}`}
      {...props}
    >
      {icon}
    </Button>
  );
};

export interface ToolbarSeparatorProps {
  className?: string;
}

export const ToolbarSeparator: React.FC<ToolbarSeparatorProps> = ({ className = '' }) => (
  <div className={`h-5 w-px bg-border-base mx-1 shrink-0 ${className}`} aria-hidden="true" />
);

export interface ToolbarDropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
}

export const ToolbarDropdown: React.FC<ToolbarDropdownProps> = ({
  trigger,
  children,
  isOpen,
  className = '',
}) => (
  <div className={`relative ${className}`}>
    {trigger}
    {isOpen && (
      <div className="absolute bottom-full mb-3 left-0 bg-surface rounded-2xl shadow-level-3 border border-border-base p-3 min-w-[280px] z-50">
        {children}
      </div>
    )}
  </div>
);

export interface ToolbarInputProps extends InputProps {}

export const ToolbarInput: React.FC<ToolbarInputProps> = ({ className = '', ...props }) => (
  <Input
    sizeVariant="sm"
    containerClassName="shrink-0"
    className={`max-w-[120px] ${className}`}
    {...props}
  />
);

export const Toolbar = Object.assign(ToolbarContainer, {
  Group: ToolbarGroup,
  Button: ToolbarButton,
  IconButton: IconButton,
  Separator: ToolbarSeparator,
  Dropdown: ToolbarDropdown,
  Input: ToolbarInput,
});
