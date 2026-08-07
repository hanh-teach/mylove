import React from 'react';
import { motion } from 'motion/react';

export type PanelVariant = 'default' | 'glass' | 'bordered' | 'elevated';
export type PanelPadding = 'none' | 'sm' | 'md' | 'lg';

export interface PanelProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: PanelVariant;
  padding?: PanelPadding;
  isCollapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  children?: React.ReactNode;
}

const PanelComponent: React.FC<PanelProps> = ({
  title,
  subtitle,
  action,
  footer,
  variant = 'default',
  padding = 'md',
  isCollapsible = false,
  defaultCollapsed = false,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const variantStyles: Record<PanelVariant, string> = {
    default: 'bg-surface border border-border-base rounded-md shadow-level-1',
    glass: 'bg-surface/80 backdrop-blur-md border border-border-subtle rounded-md shadow-level-2',
    bordered: 'bg-surface border-2 border-border-base rounded-md shadow-none',
    elevated: 'bg-surface-elevated border border-border-subtle rounded-lg shadow-level-2',
  };

  const paddingStyles: Record<PanelPadding, string> = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  const hasHeader = Boolean(title || subtitle || action || isCollapsible);

  return (
    <div className={`${variantStyles[variant]} transition-all overflow-hidden ${className}`}>
      {hasHeader && (
        <div
          className={`px-5 py-4 flex items-center justify-between border-b border-border-subtle bg-surface-elevated/40 ${headerClassName}`}
        >
          <div className="flex-1 min-w-0 pr-3">
            {typeof title === 'string' ? (
              <h2 className="text-sm font-bold text-text-main truncate">{title}</h2>
            ) : (
              title
            )}
            {subtitle && (
              <p className="text-xs text-text-muted mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {action}
            {isCollapsible && (
              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded-xs hover:bg-surface text-text-muted hover:text-text-main transition-colors"
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {!isCollapsed && (
        <motion.div
          initial={isCollapsible ? { opacity: 0, height: 0 } : false}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`${paddingStyles[padding]} ${bodyClassName}`}
        >
          {children}
        </motion.div>
      )}

      {!isCollapsed && footer && (
        <div className={`px-5 py-3 border-t border-border-subtle bg-surface-elevated/20 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

// Compound Component Subcomponents
const PanelHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`px-5 py-4 flex items-center justify-between border-b border-border-subtle bg-surface-elevated/40 ${className}`}>
    {children}
  </div>
);

const PanelTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <h2 className={`text-sm font-bold text-text-main truncate ${className}`}>{children}</h2>
);

const PanelSubtitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <p className={`text-xs text-text-muted mt-0.5 truncate ${className}`}>{children}</p>
);

const PanelAction: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`flex items-center gap-2 shrink-0 ${className}`}>{children}</div>;

const PanelBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`p-5 ${className}`}>{children}</div>;

const PanelFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`px-5 py-3 border-t border-border-subtle bg-surface-elevated/20 ${className}`}>
    {children}
  </div>
);

export const Panel = Object.assign(PanelComponent, {
  Header: PanelHeader,
  Title: PanelTitle,
  Subtitle: PanelSubtitle,
  Action: PanelAction,
  Body: PanelBody,
  Footer: PanelFooter,
});
