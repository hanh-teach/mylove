# Button Component Documentation

## Purpose
The `Button` component triggers an immediate action or workflow step within the LoveNote application. It provides visual feedback for hover, active, focus, and disabled/loading states.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'outlined' \| 'ghost' \| 'danger'` | `'primary'` | Visual hierarchy style of the button. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size scale controlling height, padding, and font size. |
| `isLoading` | `boolean` | `false` | Displays a loading spinner and disables user interaction. |
| `loadingText` | `string` | `undefined` | Optional text to show while loading. |
| `leftIcon` | `React.ReactNode` | `undefined` | Icon element to render before the label. |
| `rightIcon` | `React.ReactNode` | `undefined` | Icon element to render after the label. |
| `fullWidth` | `boolean` | `false` | Expands the button width to fill its parent container. |
| `disabled` | `boolean` | `false` | Disables user interaction and reduces opacity. |

## Variants
- **Primary**: Main call-to-action on a screen. High visual emphasis.
- **Secondary**: Alternative actions complementary to the primary action.
- **Outlined**: Subtle outline button for neutral actions.
- **Ghost**: Text-only button for low-priority interface actions.
- **Danger**: Critical or destructive actions (e.g., deletion).

## Accessibility
- Implements `type="button"` by default to prevent accidental form submissions.
- Manages `aria-disabled` and `aria-busy` when loading or disabled.
- Full keyboard support: navigable via `Tab`, actionable via `Enter` or `Space`.
- Visible focus indicator ring conforming to WCAG 2.1 AA focus visible standards.

## Usage
```tsx
import { Button } from '@/components/ui/Button';
import { Heart } from 'lucide-react';

<Button
  variant="primary"
  size="md"
  leftIcon={<Heart size={16} />}
  onClick={() => console.log('Saved')}
>
  Save LoveNote
</Button>
```

## Best Practices
- Use a single **Primary** button per major screen area to maintain clear visual hierarchy.
- Provide descriptive label text (e.g., "Save Note" instead of "Click Here").
- Always use `isLoading` instead of hiding the button during asynchronous operations.

## Anti-patterns
- Do not stack multiple Primary buttons side-by-side.
- Do not place long paragraph sentences inside button labels.
- Do not disable click handlers without passing `disabled` or `isLoading` props to the component.
