import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, containerClassName = '', className = '', ...props }, ref) => {
    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {label && (
          <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted px-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-surface border border-border-base rounded-md px-3 py-2.5 text-sm font-medium
              placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5
              transition-all disabled:bg-surface-elevated disabled:cursor-not-allowed
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/5' : ''}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-[10px] font-bold text-rose-500 px-1 italic">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
