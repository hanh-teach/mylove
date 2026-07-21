# Workflow Designer Architecture

The Workflow Designer is built as a client-side visual editor designed to produce `WorkflowDefinition` objects compatible with the backend AI Creative Workflow Engine.

## Core Components
- **WorkflowCanvas**: Visual graph interface.
- **WorkflowStore**: Centralized state management using `Zustand`.
- **WorkflowNodeRegistry**: Dynamic node management for the plugin system.
- **WorkflowDesignerService**: Persistence and import/export operations.
