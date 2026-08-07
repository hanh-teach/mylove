# AI Engine Architecture Specification
**Author:** Chief AI Architect
**Version:** 1.0.0
**Status:** Design Approved

## 1. Executive Summary
The AI Engine is designed as a modular, vendor-agnostic platform to provide "Intelligence-as-a-Service" to the Editor. By decoupling the consumption of AI from the providers (Gemini, OpenAI, etc.), we ensure high availability, cost optimization, and the ability to leverage "best-of-breed" models for specific tasks (e.g., Gemini for long context, Runway for video, Fal for image generation).

---

## 2. Architectural Layers

### A. Interface Layer (AI Facade)
*   **Purpose:** Unified API surface for the application.
*   **Responsibility:** Exposes simple methods like `ask()`, `generate()`, and `runWorkflow()`. It abstracts the complexity of prompt compilation and routing.

### B. Orchestration Layer
*   **Prompt Engine:** Manages a versioned library of templates. Supports variable injection and partials.
*   **Context Manager:** Hydrates requests using the **Project Manifest**. It compresses project data (Scenes, Assets, Metadata) into a token-efficient context window.
*   **Workflow Engine:** Handles multi-step AI sequences. For example: `Generate Script` -> `Identify Assets` -> `Create Scene Layout`.

### C. Intelligence Routing (AI Router)
*   **Model Mapping:** Routes requests based on capability (Text vs. Image) and priority.
*   **Fallback Logic:** If a provider (e.g., Gemini) returns a 429 or 500, the Router automatically shifts the load to a secondary provider (e.g., OpenAI) without the user noticing.
*   **Load Balancing:** Distributes requests based on current latency and rate limits.

### D. Provider Adapters
*   **Adapters:** Standardized wrappers for external SDKs.
*   **Response Normalizer:** Converts heterogeneous responses (different JSON structures from different providers) into a single, predictable Schema for the Editor.

---

## 3. Operational Policies

### E. Cache Layer
*   **Strategy:** TTL-based caching for deterministic requests.
*   **Mechanism:** Uses a hash of the (Prompt + Model + Parameters) as the key to prevent redundant (and expensive) API calls.

### F. Cost Tracking & Governance
*   **Granularity:** Logs token usage (Prompt vs. Completion) per Request and per Project.
*   **Budgeting:** Provides hooks to throttle or alert when a project exceeds its AI compute budget.

### G. Retry & Resilience (Retry Policy)
*   **Exponential Backoff:** Standard retry with jitter for transient network failures.
*   **Circuit Breaker:** Temporarily "kills" a provider path if failure rates exceed a threshold (e.g., 20% failure in 60 seconds).

### H. Logging & Observability
*   **Audit Trail:** Detailed logging of Prompt input vs. AI output for quality monitoring.
*   **Performance Metrics:** Tracks Latency-to-First-Token and total generation time.

---

## 4. Single Source of Truth
The AI Engine consumes the **Project Manifest** as its primary data source. This allows the AI to "see" the entire project structure exactly as the Editor does, enabling features like:
*   "Suggest a new scene based on my current theme."
*   "Find a font that matches the existing assets."
*   "Auto-animate this transition based on the scene context."

---
*End of Specification*
