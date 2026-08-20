# Sidebar Component Documentation

## Purpose
The `Sidebar` component provides primary navigation across main application sections, workspace view modes, and settings panels.

## Features
- Expandable / collapsible navigation drawer behavior.
- Active navigation item highlighting.
- Integration with application routes and theme toggle.
- Clean responsive drawer fallback for smaller viewports.

## Accessibility
- Uses semantic `<nav>` container with `aria-label="Main Navigation"`.
- Marks active route items with `aria-current="page"`.
- Support for keyboard tab traversal across navigation links.

## Usage
```tsx
import { Sidebar } from '@/components/layout/Sidebar';

<Sidebar
  activeTab={currentTab}
  onTabChange={setCurrentTab}
/>
```

## Best Practices
- Keep primary navigation items concise and visually distinct.
- Group secondary settings or tools at the bottom of the sidebar.

## Anti-patterns
- Do not clutter the sidebar with more than 8-10 top-level items.
