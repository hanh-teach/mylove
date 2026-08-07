# Toast Component Documentation

## Purpose
The `Toast` system provides unobtrusive feedback messages for system events, background sync actions, and user updates.

## Context API (`useToast`)
```tsx
const { showToast, hideToast } = useToast();
```

## `showToast` Signature
```tsx
showToast(
  message: string,
  type?: 'success' | 'error' | 'warning' | 'info' | 'loading',
  options?: { onUndo?: () => void; duration?: number }
): string
```

## Toast Types
- **Success**: Confirms successful user or system operations.
- **Error**: Alerts users to failure or network errors.
- **Warning**: Highlights non-fatal warnings requiring user attention.
- **Info**: Displays general status updates.
- **Loading**: Displays an animated spin indicator during pending tasks.

## Accessibility
- Renders toast notifications into a portal anchored at the bottom-center of the screen.
- Wraps notification region in `role="region" aria-label="Notifications"`.
- Individual toasts use `role="status"` and `aria-live="polite"`.
- Dismiss button includes `aria-label="Dismiss notification"`.

## Usage
```tsx
import { useToast } from '@/components/common/Toast';

const MyComponent = () => {
  const { showToast } = useToast();

  const handleSave = () => {
    showToast('LoveNote auto-saved', 'success', {
      onUndo: () => console.log('Undo save'),
      duration: 3000,
    });
  };

  return <button onClick={handleSave}>Save</button>;
};
```

## Best Practices
- Provide an `onUndo` callback for destructive actions like item deletion.
- Auto-dismiss non-critical success toasts after 3-5 seconds.

## Anti-patterns
- Do not show overwhelming streams of repetitive toasts.
- Do not rely on toasts as the only place where long error messages can be read.
