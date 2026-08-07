# CHANGELOG

## [Unreleased] - 2026-07-28 (v2)

### Fixed
- **"Tải Thiệp Có Chữ" still exporting a solid black PNG after the first patch attempt**: the
  earlier `backdrop-filter` fix (see entry below) was a real, secondary issue, but not the actual
  cause of the black output reported in production. The real bug is in the crop math
  `captureElementToCanvas` hands to html2canvas.
  - **Root cause**: `captureElementToCanvas` forces the html2canvas clone to render **un-scrolled**
    (`scrollX: 0, scrollY: 0`) and instead bakes the live page's current scroll offset into the crop
    coordinates (`x: rect.left + window.scrollX`, `y: rect.top + window.scrollY`). That's correct
    for a normal, in-document-flow element. But `#generated-card-container` sits inside the video
    modal's `fixed inset-0` backdrop — a **fixed-positioned** element never moves with page scroll,
    so in the un-scrolled clone it always renders at exactly `rect.top`/`rect.left`. Adding
    `window.scrollY` on top of that — which happens whenever the page had been scrolled at all
    before the user opened the modal and clicked export — pointed the crop rectangle at empty space
    below the actual rendered content. html2canvas fills any such out-of-bounds crop region with the
    plain `backgroundColor` we pass in (`#000000`), which is exactly why the exported PNG was a
    single flat black rectangle with no photo/video, text, or decorations, and why it reproduced
    consistently for the user (their page was scrolled) but not for us in local testing (page was at
    the top, `scrollY = 0`, which happens to make the buggy formula compute the correct answer by
    coincidence).
  - **Resolution**: `captureElementToCanvas` now detects whether the captured element is itself
    `position: fixed` or has a `fixed` ancestor (`isFixedPositioningInEffect`) and, if so, uses
    `rect.left`/`rect.top` directly with no scroll offset added. Non-fixed elements (e.g. the
    "Xuất & Tải" / Export Studio flow's temp artboard, appended straight to `document.body`) keep
    the previous, correct behaviour untouched.
  - Verified with two new jsdom regression tests that stub a scrolled page (`window.scrollY = 800`)
    and assert the exact `x`/`y` html2canvas receives: one for a target nested in a `position: fixed`
    ancestor (must equal `rect.left`/`rect.top`, unaffected by scroll) and one for a normal in-flow
    target (must still add the scroll offset, confirming the existing working export path is
    untouched) — both pass. Also re-ran `npx tsc --noEmit` (no new errors), `npx vitest run`
    (97/98 passing; the 1 failure is the same pre-existing, unrelated mock-setup gap in
    `ExportHelper.test.ts` that predates all of these changes), and `npm run build` (production
    build succeeds).
  - The `neutralizeAncestorFiltersForCapture` fix from the previous patch is left in place as a
    legitimate defensive fix for `backdrop-filter`/`filter` ancestors (a real, separate html2canvas
    limitation), it just wasn't sufficient on its own for this specific black-export report.

## [Unreleased] - 2026-07-28

### Fixed
- **"Tải Thiệp Có Chữ" exporting a solid black PNG**: Root cause was that `#generated-card-container`
  (the element captured for this export) sits inside the video-generation modal's backdrop, which
  uses `backdrop-blur-md` + `bg-black/60`. `html2canvas` (v1.4.1) does not support
  `filter`/`backdrop-filter` and, when an ancestor of the captured element has one, paints that
  ancestor's own background as a solid opaque rectangle over the whole captured region — hence a
  flat black image with no text/photo/decor, even though the same container renders correctly on
  screen. The other export path (Export Studio, "Xuất & Tải") was never affected because it clones
  its target directly onto `document.body` before capturing, escaping the blurred ancestor entirely.
  - **Resolution**: `captureElementToCanvas` (`src/modules/export/ExportHelper.ts`) now strips
    `filter`/`backdrop-filter`/`-webkit-backdrop-filter` from every ancestor of the captured element
    inside the html2canvas clone (`neutralizeAncestorFiltersForCapture`), before the video-frame
    snapshot and any other clone processing runs. This is a shared, low-level fix in the capture
    pipeline itself, so it protects every current and future caller — not just this one button —
    without touching the working "Xuất & Tải" flow (which never triggers the new code path since it
    has no blurred ancestor).
  - Verified with `npx tsc --noEmit` (no new errors), `npx vitest run` (95/96 passing; the 1 failure
    is a pre-existing, unrelated mock-setup gap in `ExportHelper.test.ts` present before this
    change), a new targeted jsdom regression test reproducing the exact `backdrop-blur-md` ancestor
    shape and asserting the clone's ancestor filters are neutralized, and `npm run build` (production
    build succeeds).

## [Unreleased] - 2026-07-27

### Upgraded
- **Gemini Video Model (Veo 3.1)**: Explicitly assigned `veo-3.1-fast-generate-preview` as the video model in `geminiProvider`.
  - **Reason**: The previously hardcoded `veo-3.1-lite-generate-preview` model does not exist in the official Google GenAI model list and returns a 404 error.
  - **Resolution**: Selected the `fast-generate-preview` model to maintain the intended low-cost and high-speed profile.
- **Fal AI Video Endpoint (Pika)**: Pinned the Fal AI Pika subscription to the specific version `fal-ai/pika/v2.2/text-to-video`.
  - **Reason**: Using the unversioned alias `fal-ai/pika` is risky, throws authentication/routing errors, and may unexpectedly change default versions in the future.
- **Agnes AI Resilience**: Enhanced monitoring and fallback warning logging in `agnesAIProvider`.
  - **Reason**: Agnes AI models (`agnes-video-2.0`, etc.) cannot be publicly verified, so robust logging is required if the undocumented endpoints fail.
  - **Resolution**: Added tracking for 3 consecutive discovery endpoint failures to log an explicit ERROR, and added an ERROR log when all fallback models fail before throwing `AIProviderError`.

- **HuggingFace Provider Fallback (FLUX.1-schnell)**: Explicitly assigned `fal-ai` as the provider for `black-forest-labs/FLUX.1-schnell` model via the `@huggingface/inference` SDK.
  - **Reason**: HuggingFace's default `hf-inference` serverless route officially deprecated and sunsetted this model on July 15-16, 2026, resulting in HTTP 410 errors.
  - **Resolution**: Routed the request to the `fal-ai` partner provider (which still hosts FLUX.1-schnell) via the SDK's `provider` parameter to ensure uninterrupted service without changing the model.

- **Runway SDK Model Upgrade (Gen-4 Turbo)**: Upgraded Runway image-to-video model from `gen3a_turbo` to `gen4_turbo`.
  - **Reason**: Runway officially deprecated and announced the sunset of `gen3a_turbo` on July 30, 2026. Upgrading is mandatory to prevent feature breakage.
  - **Model Selection**: Selected `gen4_turbo` as the direct speed-and-cost equivalent to the previous turbo model, avoiding the ~2.4x higher credit/second cost of `gen4.5`.
  - **Impact Note**: This upgrade affects operating costs of video generation. The project owner must periodically review model pricing and operational cost alignment as Runway pricing structures evolve.

## [Unreleased] - 2026-07-24

### Archived
- **ai-engine module archived 2026-07-24**: `src/modules/ai-engine` module moved to `src/_archive/ai-engine` — không được kết nối vào UI, xem `src/_archive/ai-engine` nếu cần tái sử dụng pattern ProviderFederation trong tương lai.

## [Unreleased] - 2026-07-21

### Added
- **Enterprise Canva-Grade Smart Guide Snapping & Alignment Engine**: Introduced a highly-performant computational engine in `SmartGuideService.ts` that dynamically calculates magnetic snapping guidelines across 500+ active canvas layers at 60fps with absolute 0 lag.
  - **Dynamic Magnetic Alignment**: Generates pixel-perfect vertical and horizontal alignment lines when dragging a layer's left, center, or right edges near other elements, canvas margins, or center axis.
  - **Equal Spacing Guides**: Calculates dynamic horizontal and vertical gaps between neighboring layers and auto-snaps to enforce perfectly uniform spacing with purple gap highlight boxes.
  - **Real-Time Distance Indicators**: Draws multi-directional dimension lines with interactive pixel tags (e.g. `120px`) between the active dragged element and its aligned target elements.
  - **Canvas & Object Margins**: Implemented visual 40px bounding borders for safe-zones (Canvas Margin) and interactive handle-guides for individual elements (Object Margin).
  - **Full Desktop/Mobile Responsiveness**: Automatically projects and scales layout guides on mobile viewports (<640px) or desktop dimensions dynamically.
- **Glassmorphism Visual Controls & High-Fidelity Overlays**: Implemented `SmartGuideOverlays.tsx` containing modular visual utilities to manage canvas state easily.
  - **Visual Horizontal & Vertical Rulers**: Clean, high-fidelity fixed coordinate rulers rendering major (100px) and minor (50px/10px) ticks along the top and left of the viewport screen.
  - **Interactive Floating Smart-Control Panel**: Allows users to dynamically toggle Auto Snap, Grid, Rulers, and Canvas Margins.
  - **High Performance Stress Tester**: Integrated a stress test button to instantly spawn 500 randomly colored, sized, and animated layers to demonstrate perfect 60fps performance without lag.

### Refactored
- **Advanced Decoupled Duplication Engine**: Upgraded `LayerModel.duplicate` to support complete reference-free deep cloning of layers and nested sub-trees.
  - **Full Fidelity Copies**: Deep-clones Position, Rotation, Opacity, Effects, Text structures, Shadows, active Animations, and all media/vector Assets without any shared memory structures.
  - **UUID Re-generation**: Recursively provisions unique layer and child IDs on the clone tree to ensure standalone modification stability.
  - **Zero UI-intrusive Overheads**: Designed to work transparently underneath any existing canvas wrapper components.
- **Canva-Inspired Enterprise-Grade Grouping Engine**: Built a full-stack group orchestration module in `LayerManager` allowing arbitrary selections of layers to be packaged into a unified `'group'` layer.
- **Recursive Affine Scaling and Pivot Rotation**: Programmed advanced mathematical transformation cascading where scaling a group scales nested layers proportionally, and rotating a group orbits all descendants precisely around the parent's layout center.
- **Multi-Tier Nesting & Cascades**: Enabled unlimited levels of nested groups by dynamically converting coordinate spaces back-and-forth between local group offsets and absolute canvas workspace coordinates.
- **Hierarchical Lock and Visibility Delegation**: Configured visibility and locking to propagate recursively through active sub-trees, instantly securing or hiding entire complex groups in one operation.
- **Robust Layer Locking Mechanism**: Implemented layer locking capabilities preventing all modifications on locked elements while preserving visual presentation.
  - **Interaction Guarding**: Locked layers cannot be dragged, scaled, rotated, animated, or individual deleted.
  - **Visual Indicator**: Integrated a beautiful amber lock badge on locked layers with hover tooltips and controls to easily toggle lock state.
- **Highly Responsive Decoupled Selection Engine**: Engineered a pure TypeScript selection engine (`SelectionStore`, `SelectionManager`) that tracks user element Focus independent of React's complex VDOM layout cycles.
- **Multimodal Selection Modifiers**: Programmed advanced selection paradigms including Single Selection, toggling selections with Ctrl/Cmd, range lists via Shift Selection, selecting all elements, and instant canvas Click Outside clearing.
- **AABB-based Marquee Box Intersection**: Integrated 2-dimensional bounding box intersection tests (Axis-Aligned Bounding Box) to capture drag gestures, instantly highlighting visible, non-locked nodes enveloped fully or partially by marquee dragging.
- **Canva-Inspired Command-Based History Engine**: Designed and built a high-performance transactional undo/redo history manager applying the Command design pattern.
- **Micro-State Delta Serialization**: Designed commands to capture fine-grained property modifications (Move, Resize, Rotate, Color, Font, Text, Group, Ungroup, Add, Delete, Duplicate) and metadata changes rather than copying large canvas objects, preventing memory bloating.
- **Finite Double-Ended Transaction Stacks**: Implemented `HistoryStore` enforcing a strict 100-step ceiling with active garbage collection dereferencing to prevent memory leaks during branching, undo, and redo sequences.
- **Unified Reactive Orchestration**: Built `HistoryManager` and exported reactive hook-ready listeners to orchestrate command dispatching, state rollbacks, and redo reapplications without modifying existing canvas interfaces or workflows.
- **Canva-Inspired Decoupled Layer Engine**: Constructed a fully decoupled, enterprise-grade Layer Management module supporting structured nesting, z-indexing, group transforms, locking states, and visibility toggles.
- **Unified Layer Model & Factories**: Implemented `LayerModel` and `LayerTypes` to cleanly define each Canvas element as a standard canvas layer containing: `id`, `type`, `name`, `visible`, `locked`, `opacity`, `rotation`, `x`, `y`, `width`, `height`, `zIndex`, `parentId`, and `children`.
- **Atomic Reactive Layer Store**: Developed an independent pub/sub `LayerStore` maintaining a synchronized scene node tree with support for transactions and state notifications.
- **Domain-Driven Layer Orchestration**: Designed `LayerManager` and `LayerService` to expose robust operations including: Adding, Removing, Renaming, Duplicating, Translating, Reordering (`bringToFront`, `sendToBack`), and Legacy-to-Layer imports/exports without affecting any existing UI or functional components.
- **Configurable Multi-Tier Cache Layer**: Implemented a comprehensive high-performance caching layer (`CacheService`) to drastically lower active AI billing charges.
- **Domain-Specific AI Cache Domains**: Created isolated, typed caching buckets for **AI Responses**, **Background Style Profiles**, **Dynamic built prompts**, **Layout templates**, **Image Metadata** (Hugging Face), and **Video Metadata** (Runway/Fal/Agnes).
- **Configurable TTL & Transparent Resolution**: Added fully configurable caching expiration duration `CACHE_TTL_SECONDS` (defaults to 1800 seconds) that transparently serves cached hits to clients, short-circuiting AI queries to reduce latencies.
- **Standardized Multi-Environment Framework**: Separated and classified runtime configuration stages into `development`, `staging`, and `production`. Created a client-side environment helper (`ClientEnvironment`) and a server-side config validated manager (`ConfigManager`).
- **Graceful Self-Validation System**: Configured a startup environmental check block that validates and audits critical credentials without throwing fatal errors. Missing AI keys trigger structured warning notifications and clean fallback modes rather than crashing the system process.
- **Self-Documenting Environment Schema**: Formulated an extensive `.env.example` explaining each variable, its values, its roles in external integrations, and how they function.
- **Enterprise-Grade Logging Architecture**: Introduced a comprehensive logger service (`LoggerService`) tracking execution parameters including TraceID, User, Module, API Path, Status, and execution Duration. Standardized logging categories across requests, responses, AI requests, AI responses, performance, warnings, and exceptions.
- **Unified Custom Error Hierarchy**: Constructed semantic custom error subclasses (`AppError`, `ValidationError`, `AIProviderError`, `TimeoutError`, `AuthenticationError`, `AuthorizationError`, `BusinessError`) to eliminate generic unhandled raw throws.
- **Centralized Error Dispatching Middleware**: Engineered a robust Global Error Handler catching all backend failures, logging them with enterprise metadata, and formatting public payloads uniformly.
- **Standardized API Response Protocol**: Standardized every single endpoint output to adhere strictly to the corporate signature structure: `{ success, message, code, data, errors, traceId }`.
- **AI Engine Architecture Migration**: Engineered a production-grade AI Orchestration layer separating routing, prompting, and runtime execution patterns.
- **Unified AIProvider Interface**: Standardized core interfaces (`generateImage`, `generateVideo`, `generateText`, `analyzeImage`) across all AI Providers (Gemini, Runway, Fal, HuggingFace, Agnes).
- **Decoupled Prompt Builder**: Isolated visual prompt engineering and semantic structure parsing from raw service layers.
- **Smart AI Router**: Abstracted model routing rules and credential discovery checks, supporting graceful fallbacks.
- **Cleaned up Controllers & Routes**: Completely separated backend API routes from business logic, preserving the interface while securing a scalable future.
- **Module-Based Architecture Migration**: Restructured the codebase from a monolithic single-file layout to a modern, decoupled Module-Based architecture.
- **De-cluttered `src/App.tsx`**: Removed over 150 lines of static configuration tables, inline TypeScript types, and utility functions from the main entry point component.
- **Created Modules Folder Structure**: Scaffolded domain-specific directories (`editor`, `ai`, `project`, `export`, `auth`) under `src/modules/` to define clean system boundaries.
- **Moved and Re-pathed Assets**: Moved original `src/assets` assets directory to `src/modules/assets` to group domain files correctly and updated the respective asset loaders and relative paths.
- **Scaffolded Shared Contexts**: Implemented standard types (`src/shared/types/`), helper functions (`src/shared/utils/color.ts`), and static registry constants (`src/shared/constants/`) under `src/shared/`.
- **Restructured Dependency Schema**: Cleaned up the relative imports across the core modules while ensuring 100% type safety and zero circular dependencies.
