# Project Engine Architecture
*(Architect: Chief Software Architect - 25 Years Experience)*

## Overview
This document outlines the architectural transformation of the application from a standalone Image Editor to a comprehensive Project-Based Editor, adopting patterns utilized by industry leaders like Canva and Figma.

## 1. Domain Model (Entity Hierarchy)

The core domain model follows a strict hierarchical tree structure:

`Workspace -> Project -> Scene -> Layer -> Asset`

*   **Workspace**: The top-level isolation boundary. Belongs to a user or a team. Contains multiple Projects.
*   **Project**: A single design document. Contains metadata (name, author, created_at, updated_at) and a collection of Scenes.
*   **Scene (Artboard/Page)**: An infinite canvas or fixed-size artboard within a Project. Contains its own specific configuration (background, dimensions) and a nested tree of Layers.
*   **Layer (Node)**: The fundamental building block on a Scene. Can be groups, shapes, text, or decor items. Contains transform data (x, y, scale, rotation, z-index), stylistic properties, and locking/visibility states.
*   **Asset**: Reusable binary or vector resources (images, fonts, SVGs, audio) referenced by Layers. Decoupled from the Layer itself to ensure deduplication.

## 2. Data Flow

The data flow follows a Unidirectional Data Flow (UDF) pattern, ensuring predictability.

1.  **Action Dispatch**: User interacts with the UI, which triggers an Intent/Action (e.g., `MOVE_LAYER`, `ADD_SCENE`).
2.  **State Mutation (Reducer/Engine)**: The Action is sent to the central Project Engine. The engine calculates the delta and applies it to the current Project state.
3.  **History Record**: The delta (or snapshot, depending on the strategy) is recorded in the History Manager for Undo/Redo capabilities.
4.  **State Broadcast**: The updated state is broadcasted to subscribed UI components via Selectors.
5.  **Render**: Components re-render only if their specific slice of state has changed (leveraging Virtual Rendering and Memoization).

## 3. State Management

The State Management strategy isolates application state into distinct stores to prevent cross-contamination and unnecessary re-renders.

*   **Document State (Persisted)**: The actual Project tree (Scenes, Layers). This is the source of truth that gets saved to the database/storage.
*   **Ephemeral State (Local)**: UI-specific states that are not saved (e.g., current selection, zoom level, pan offset, active tool, hover states).
*   **Asset Cache (In-Memory)**: A registry of loaded assets to prevent redundant network requests and memory bloat.

*Pattern*: Normalized state shape. Instead of a deep nested JSON tree, Layers and Scenes should be stored in a flat dictionary (normalized map) referencing IDs to optimize deep updates and `O(1)` lookups.

## 4. API Design

The API will be designed around GraphQL or RESTful principles with a focus on partial updates to minimize payload sizes.

*   **Queries**:
    *   `GET /workspaces/{id}/projects`
    *   `GET /projects/{id}` (Returns the full Project structure)
    *   `GET /projects/{id}/assets` (Returns manifest of required assets)
*   **Mutations (RPC-style or PATCH)**:
    *   `PATCH /projects/{id}` (For metadata updates)
    *   `POST /projects/{id}/sync` (Batch sync endpoint for Layer/Scene deltas)
*   **WebSocket/Real-time**:
    *   A WebSocket connection for multi-player presence (cursors, selections) and real-time operational transformation (OT) or CRDT sync events.

## 5. Storage Strategy

To handle large projects efficiently, the storage mechanism uses a tiered approach.

*   **Local Storage (IndexedDB)**: Acts as the primary local cache and offline storage. The entire Project structure is continuously flushed here.
*   **Cloud Storage (Blob/Object Storage)**: Assets (images, custom fonts) are uploaded directly to an S3-compatible Blob storage. The database only stores their URLs.
*   **Cloud Database (NoSQL/NewSQL)**: Project metadata and the JSON representation of the Document State are stored here. For very large projects, the JSON blob is stored in Object Storage, and the DB only holds a pointer.

## 6. Version Control (History)

The versioning system goes beyond simple local undo/redo.

*   **Local History (Undo/Redo)**: Managed in-memory using an Action-based delta list. Each action has an inverse (e.g., Move(x: 10) -> Inverse(x: -10)).
*   **Snapshotting**: Every milestone (e.g., every 50 actions, or explicit "Save Version" command) creates a complete snapshot of the Document State.
*   **Delta Compression**: Between snapshots, only the sequential deltas are stored. Reconstructing a version involves loading the closest snapshot and applying deltas forward.

## 7. Auto Save Architecture

Auto-saving must be completely non-blocking to the main thread.

1.  **Throttled Queue**: Local mutations are pushed to an in-memory queue.
2.  **Debounced Flush**: A debounced Web Worker or idle callback monitors the queue. After a period of inactivity (e.g., 2 seconds) or a threshold (e.g., 20 changes), the queue is flushed.
3.  **Optimistic UI**: The UI immediately reflects changes, while the background sync process handles writing to IndexedDB and subsequently syncing to the Cloud Database.
4.  **Conflict Resolution**: In case of network drops, local IndexedDB acts as the source of truth. Upon reconnection, a Last-Write-Wins (LWW) or CRDT resolution strategy merges local changes with the remote server.

## 8. Future Expansion

The architecture is designed to accommodate future growth without structural refactoring.

*   **Multiplayer / Collaboration (CRDT)**: By normalizing the state and isolating the mutation engine, integrating Yjs or Automerge for real-time collaboration becomes a pluggable extension.
*   **Plugin Ecosystem**: The clear separation between Ephemeral State, Document State, and the Action Dispatcher allows exposing a sandboxed API (via Web Workers or Iframes) for third-party plugins to interact with the Project Engine safely.
*   **Cross-Platform (WASM / Native)**: Core engine logic (Transform Manager, History Manager, rendering calculations) can be abstracted and potentially rewritten in Rust/C++ compiled to WebAssembly for near-native performance, while keeping the React UI layer intact.
