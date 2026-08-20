# Input Component Documentation

## Purpose
The `Input` component allows users to enter text, numbers, and user data. It includes support for form labels, error messages, helper texts, and custom leading or trailing icons.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `undefined` | Upper label text associated with the input element. |
| `error` | `string` | `undefined` | Error message displayed below the input. Triggers error visual state. |
| `helperText` | `string` | `undefined` | Guidance text displayed below the input when no error is present. |
| `sizeVariant` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height and font size variant. |
| `leftIcon` | `React.ReactNode` | `undefined` | Icon element anchored to the left of the input field. |
| `rightIcon` | `React.ReactNode` | `undefined` | Icon element anchored to the right of the input field. |
| `containerClassName` | `string` | `''` | Custom CSS classes for the wrapping container. |

## Variants
- **Standard**: Default input field with subtle border.
- **Error State**: Highlighted red border with `role="alert"` for form validation feedback.
- **Disabled State**: Reduced opacity with `cursor-not-allowed` background.

## Accessibility
- Auto-generates unique `id` attributes via React `useId()` if `id` is not provided.
- Connects labels via `htmlFor`.
- Connects helper text and error messages using `aria-describedby`.
- Sets `aria-invalid="true"` automatically when `error` prop is passed.

## Usage
```tsx
import { Input } from '@/components/ui/Input';
import { Mail } from 'lucide-react';

<Input
  label="Email Address"
  placeholder="partner@example.com"
  leftIcon={<Mail size={16} />}
  helperText="We will never share your private note email."
/>
```

## Best Practices
- Always supply a `label` or an `aria-label` for screen reader accessibility.
- Keep helper texts concise and direct.
- Clear error messages immediately when the user fixes input errors.

## Anti-patterns
- Do not rely on placeholder text as a replacement for labels.
- Do not show raw unformatted backend error stack traces in the `error` prop.
