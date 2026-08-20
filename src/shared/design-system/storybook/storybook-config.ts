/**
 * Storybook Structural Blueprint & Metadata Config
 * Provides zero-dependency component meta-definitions and preview configuration for LoveNote Design System.
 */

export interface StorybookComponentMeta {
  title: string;
  componentName: string;
  category: 'Base Components' | 'Overlay Components' | 'Layout Components';
  description: string;
  variants: string[];
}

export const designSystemCatalog: StorybookComponentMeta[] = [
  {
    title: 'Components/Base/Button',
    componentName: 'Button',
    category: 'Base Components',
    description: 'Enterprise standard button with variants, sizes, loading states, and icon slots.',
    variants: ['primary', 'secondary', 'outlined', 'ghost', 'danger'],
  },
  {
    title: 'Components/Base/Input',
    componentName: 'Input',
    category: 'Base Components',
    description: 'Form text input with validation errors, helper text, and icon adornments.',
    variants: ['sm', 'md', 'lg', 'error', 'disabled'],
  },
  {
    title: 'Components/Base/Card',
    componentName: 'Card',
    category: 'Base Components',
    description: 'Container component with elevated visual variants and compound header/title/body/footer parts.',
    variants: ['default', 'elevated', 'outlined', 'flat'],
  },
  {
    title: 'Components/Base/Panel',
    componentName: 'Panel',
    category: 'Base Components',
    description: 'Structured panel with optional header actions, subtitle, and collapsible behavior.',
    variants: ['default', 'glass', 'bordered', 'elevated'],
  },
  {
    title: 'Components/Overlay/Dialog',
    componentName: 'Dialog',
    category: 'Overlay Components',
    description: 'Portal-rendered modal overlay with focus trapping and ESC key listener.',
    variants: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
  },
  {
    title: 'Components/Overlay/Tooltip',
    componentName: 'Tooltip',
    category: 'Overlay Components',
    description: 'Hover and focus contextual popup hints.',
    variants: ['top', 'bottom', 'left', 'right'],
  },
  {
    title: 'Components/Overlay/Toast',
    componentName: 'Toast',
    category: 'Overlay Components',
    description: 'Global notification toaster with undo capability.',
    variants: ['success', 'error', 'warning', 'info', 'loading'],
  },
  {
    title: 'Components/Layout/Sidebar',
    componentName: 'Sidebar',
    category: 'Layout Components',
    description: 'Primary workspace navigation panel with collapsibility.',
    variants: ['expanded', 'collapsed'],
  },
];
