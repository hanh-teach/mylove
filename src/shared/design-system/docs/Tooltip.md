# Tooltip Component Documentation

## Purpose
The `Tooltip` component presents short contextual hints when users hover over or focus an interactive element.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `React.ReactNode` | `required` | Message string or node rendered inside the tooltip popup. |
| `children` | `React.ReactElement` | `required` | Interactive trigger component wrapped by the tooltip. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Preferred positioning relative to the trigger element. |
| `delayMs` | `number` | `200` | Delay in milliseconds before opening the tooltip. |

## Accessibility
- Renders popup into React Portal (`document.body`) to prevent overflow clipping.
- Uses `role="tooltip"`.
- Triggers on both keyboard focus (`onFocus`/`onBlur`) and pointer hover (`onMouseEnter`/`onMouseLeave`).

## Usage
```tsx
import { Tooltip } from '@/components/common/Tooltip';
import { Button } from '@/components/ui/Button';

<Tooltip content="Quick Save (Ctrl+S)" placement="top">
  <Button variant="ghost">Save</Button>
</Tooltip>
```

## Best Practices
- Keep text short and scannable (1-5 words).
- Use tooltips to explain icon-only buttons.

## Anti-patterns
- Do not place critical required workflow information solely inside tooltips.
- Do not place interactive buttons or links inside tooltip content.
