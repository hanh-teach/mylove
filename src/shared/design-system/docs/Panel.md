# Panel Component Documentation

## Purpose
The `Panel` component provides a structured content section with optional header actions, subtitle metadata, footer controls, and smooth collapsible behavior.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `React.ReactNode` | `undefined` | Main heading of the panel. |
| `subtitle` | `React.ReactNode` | `undefined` | Secondary descriptive text under the title. |
| `action` | `React.ReactNode` | `undefined` | Action controls rendered on the right side of the panel header. |
| `footer` | `React.ReactNode` | `undefined` | Footer component rendered at the bottom. |
| `variant` | `'default' \| 'glass' \| 'bordered' \| 'elevated'` | `'default'` | Visual surface style. |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Content body padding. |
| `isCollapsible` | `boolean` | `false` | Enables toggle button to expand/collapse panel body. |
| `defaultCollapsed` | `boolean` | `false` | Initial collapsed state. |

## Variants
- **Default**: Solid background with level-1 shadow.
- **Glass**: Semi-transparent backdrop-blur styling.
- **Bordered**: High-contrast bordered container.
- **Elevated**: Elevated background with soft shadow.

## Accessibility
- Collapsible toggle controls carry `aria-expanded` and `aria-label`.
- Clean keyboard tab navigation into panel actions.

## Usage
```tsx
import { Panel } from '@/components/ui/Panel';

<Panel
  title="AI Writing Assistant"
  subtitle="Suggestions and style checks"
  isCollapsible
  variant="glass"
>
  <p>Content editor analysis feedback...</p>
</Panel>
```

## Best Practices
- Use collapsible panels for dense sidebars or inspector tools.
- Provide clear concise panel titles.

## Anti-patterns
- Do not hide critical primary app workflows inside collapsed panels by default.
