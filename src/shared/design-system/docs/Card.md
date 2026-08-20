# Card Component Documentation

## Purpose
The `Card` component acts as a structured container to group related information, media, and interactive controls.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'elevated' \| 'outlined' \| 'flat'` | `'default'` | Visual treatment (borders, background, and shadows). |
| `padding` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Content inner padding scale. |
| `isHoverable` | `boolean` | `false` | Enables interactive hover elevation and cursor pointer. |

## Sub-components
- `Card.Header`: Container for card headers and title actions.
- `Card.Title`: Standardized card heading styling.
- `Card.Body`: Main content area.
- `Card.Footer`: Bottom bar for actions or secondary metadata.

## Variants
- **Default**: Soft border with subtle level-1 elevation shadow.
- **Elevated**: Deeper level-2 shadow for prominent floating cards.
- **Outlined**: High-contrast border with flat background.
- **Flat**: Subtle elevated surface background with no border or shadow.

## Accessibility
- Automatically sets `role="button"` and `tabIndex={0}` when card is interactive (`isHoverable` or `onClick` present).
- Supports keyboard activation when focused.

## Usage
```tsx
import { Card } from '@/components/ui/Card';

<Card variant="elevated" isHoverable onClick={handleClick}>
  <Card.Header>
    <Card.Title>Love Memory</Card.Title>
  </Card.Header>
  <Card.Body>
    <p>Captured moments from Paris trip.</p>
  </Card.Body>
</Card>
```

## Best Practices
- Use `Card.Header` and `Card.Footer` for structural consistency.
- Maintain equal inner padding ratios across card groups.

## Anti-patterns
- Avoid deeply nesting cards inside other cards.
- Do not mix different padding scale choices within a single card grid view.
