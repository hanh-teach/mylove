
# mylove

# Editor Architecture

The editor uses a modular architecture managed by an `EditorEngine`:

```
Editor Engine
│
├── Canvas Engine
├── Layer Manager
├── History Manager
├── Selection Manager
├── Transform Manager
├── Grid Manager
├── Zoom Manager
├── Auto Save Manager
├── Export Manager
├── Clipboard Manager
├── Shortcut Manager
├── Performance Manager
└── Plugin Manager
```

## Performance Optimizations
- Virtual Rendering (Frustum Culling via `DecorItemRenderer.tsx`)
- React `memo` (Layer Cache)
- Lazy Render (Visibility checks on items)
- RequestAnimationFrame throttling (Debounce / Throttle)
- Dirty Rectangle concept logic implemented on rendering viewport.

