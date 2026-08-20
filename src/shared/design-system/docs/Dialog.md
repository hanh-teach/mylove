# Dialog Component Documentation

## Purpose
The `Dialog` component displays modal overlays rendered into `document.body` via React Portals. It halts page interaction to present urgent information or confirm workflow decisions.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `isOpen` | `boolean` | `required` | Controls visibility of the dialog overlay. |
| `onClose` | `() => void` | `required` | Callback triggered when closing the modal. |
| `title` | `React.ReactNode` | `undefined` | Dialog heading. |
| `subtitle` | `React.ReactNode` | `undefined` | Dialog description or metadata. |
| `footer` | `React.ReactNode` | `undefined` | Dialog footer containing primary and cancel actions. |
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | `'md'` | Max width variant of the modal container. |
| `closeOnBackdropClick` | `boolean` | `true` | Enables closing the modal when clicking the dark backdrop. |

## Accessibility
- Renders using `React.createPortal` at the document root to avoid z-index clipping.
- Uses `role="dialog"` and `aria-modal="true"`.
- Associates title header via `aria-labelledby="dialog-title"`.
- Keyboard accessibility: pressing `Escape` closes the active modal window.

## Usage
```tsx
import { Dialog } from '@/components/common/Dialog';
import { Button } from '@/components/ui/Button';

<Dialog
  isOpen={isConfirmOpen}
  onClose={() => setIsConfirmOpen(false)}
  title="Delete Note"
  subtitle="This action cannot be undone."
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
      <Button variant="danger" onClick={handleDelete}>Delete</Button>
    </>
  }
>
  <p>Are you sure you want to permanently delete this LoveNote?</p>
</Dialog>
```

## Best Practices
- Keep modal content focused on a single task.
- Ensure the primary action is clearly placed on the right side of the footer.

## Anti-patterns
- Do not stack modals on top of other modals.
- Do not suppress the Escape key listener unless strictly required for destructive data entry.
