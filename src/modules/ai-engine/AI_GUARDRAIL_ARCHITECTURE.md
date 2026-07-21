# AI Guardrail Architecture

The AI Guardrail Engine acts as a mandatory validation layer before any AI request is processed.

## Architecture Flow

Editor -> AIFacade -> GuardrailEngine -> Prompt Engine -> Context Engine -> Capability Registry -> Model Registry -> AI Router -> Provider

## Key Components

- **GuardrailEngine**: Orchestrates the validation process.
- **PolicyEngine**: Evaluates registered policies against request context.
- **DecisionEngine**: Makes the final decision (ALLOW, BLOCK, etc.) based on policies and risk scores.
- **Detectors/Validators**: Specialized modules for PII detection, injection detection, etc.
