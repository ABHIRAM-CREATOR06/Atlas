# Atlas Agent Specification

## Purpose

Atlas is a browser-based communication-protocol explainer and trace-analysis tool. It should help a user understand how a protocol works, inspect the messages and operations that occurred, verify whether a trace follows the protocol, and explore failure and attack scenarios.

The current repository is a React, TypeScript, and Vite prototype. It already supports bundled protocol definitions, bundled JSONL traces, an interactive sequence diagram, a state timeline, an event inspector, and basic trace validation. The current implementation is a static replay tool rather than a complete communication-protocol explainer.

## Product direction

Build Atlas as a **general communication-protocol visualizer with cryptographic depth**. It must support cryptographic handshakes such as X3DH, Double Ratchet, Noise, and TLS, while also supporting ordinary network and application protocols such as TCP, HTTP, DNS, WebSocket, MQTT, and RPC flows.

Atlas must explain both:

1. **What happened.** This includes messages, packet direction, operations, state changes, timing, errors, retries, and dependencies.

1. **Why it matters.** This includes plain-language explanations, security properties, reliability guarantees, assumptions, failure consequences, and attacker visibility.

Do not limit the architecture to the bundled X3DH + Double Ratchet example. Protocol-specific behavior must remain declarative or be implemented through explicit adapters. Core rendering and inspection components must not hardcode one protocol.

## Current baseline

The existing application provides the following functionality:

- React + TypeScript + Vite frontend.

- Static protocol definitions in `src/data/protocols.ts`.

- Static JSONL traces in `src/data/traces.ts`.

- Basic parser and validator in `src/lib/trace.ts`.

- Sequence diagram rendering in `src/components/SequenceDiagram.tsx`.

- State timeline rendering in `src/components/StateTimeline.tsx`.

- Event inspection in `src/components/Inspector.tsx`.

- Protocol selection through a bundled protocol picker.

- Symbolic references rather than real key material.

- Production build through `npm run build`.

The current limitations are significant:

- Users cannot import a protocol definition or trace.

- Traces are linear and bundled at build time.

- The protocol model lacks phases, message schemas, transitions, explanations, security properties, and failure modes.

- The visualizer has no generic state-machine view.

- The inspector does not display structured message payloads or raw representations.

- There is no guided learning mode.

- There is no expected-versus-actual protocol verification.

- There are no live instrumentation adapters.

- There are no threat-model overlays.

- The repository should include this file as the implementation contract.

## Non-negotiable design principles

### Protocol-agnostic core

Protocol-specific information must come from a versioned protocol definition, trace data, or an adapter. Do not add protocol-specific conditionals to shared renderers unless the behavior is genuinely generic.

### Safe data handling

Atlas must never require real private keys, session secrets, or plaintext sensitive payloads. Traces should support symbolic references, redacted values, truncated hashes, or locally generated identifiers. Any import or adapter must make the privacy behavior explicit.

### Explanation is a first-class feature

Every visible protocol step should be explainable in plain language. A diagram without context is a debugger, not an explainer.

### Local-first operation

Static examples and imported traces should work entirely in the browser. Do not introduce a backend for the core MVP. Any future hosted or live functionality must be optional and must document what data leaves the browser.

### Deterministic replay

Given the same protocol definition, trace, and scenario configuration, Atlas must produce the same state and explanations. Replay state should be derived from the trace rather than mutated inconsistently by individual views.

### Accessible interaction

Every diagram interaction must have an equivalent keyboard-accessible, text-based representation. Do not communicate meaning through color alone.

## Target user experience

A user should be able to open Atlas, choose or import a protocol, and immediately answer the following questions:

- Who are the participants?

- What phase of the protocol is active?

- Which message or operation is occurring?

- What data does it contain?

- What values does it depend on?

- What state changes as a result?

- Why is this step required?

- What security or reliability property does it provide?

- What happens if the step fails, is delayed, duplicated, or altered?

- Does the observed trace satisfy the protocol definition?

## Protocol definition contract

Expand the existing `ProtocolDefinition` type into a versioned schema. At minimum, the definition must support:

```
export type ProtocolDefinition = {
  schemaVersion: string;
  id: string;
  name: string;
  version: string;
  category: string;
  description: string;
  documentationUrl?: string;
  learningObjectives?: string[];

  actors: ActorDefinition[];
  roles?: RoleDefinition[];
  assumptions?: AssumptionDefinition[];
  phases: PhaseDefinition[];
  messages: Record<string, MessageDefinition>;
  operationTypes: Record<string, OperationTypeDefinition>;
  stepTypes: Record<string, StepTypeDefinition>;
  stateVariables: StateVariableDefinition[];
  transitions: TransitionDefinition[];
  invariants?: InvariantDefinition[];
  securityProperties?: SecurityPropertyDefinition[];
  failureModes?: FailureModeDefinition[];
  glossary?: GlossaryEntry[];
  views: ViewId[];
};
```

The schema must describe:

- Actors and roles.

- Protocol phases.

- Message types and structured fields.

- Encodings and payload formats.

- Operations such as signing, hashing, key derivation, encryption, MAC verification, and compression.

- State variables and their owners.

- Valid state transitions.

- Optional and conditional messages.

- Expected responses and correlation relationships.

- Invariants that must remain true.

- Security and reliability properties.

- Known failure modes.

- Human-readable explanations.

- Glossary terms and external references.

Each message, operation, step, and transition should support explanation metadata:

```
export type Explanation = {
  short: string;
  detailed?: string;
  purpose?: string;
  prerequisites?: string[];
  securityProperty?: string;
  failureImpact?: string;
  relatedTerms?: string[];
};
```

Use JSON Schema or an equivalent runtime validation system for imported definitions. The TypeScript type alone is not sufficient for untrusted input.

## Trace format contract

Replace the minimal trace contract with a versioned format that supports real communication behavior while remaining safe to store.

```
export type TraceEvent = {
  schemaVersion?: string;
  id: string;
  t: number;
  wallTime?: string;
  actor: string;
  event: string;
  phase?: string;

  from?: string;
  to?: string;
  messageType?: string;
  messageId?: string;
  correlationId?: string;
  parentId?: string;

  sequence?: number;
  transport?: string;
  status?: "sent" | "received" | "delayed" | "dropped" | "duplicated" | "retransmitted" | "failed";
  deliveredAt?: number;

  label?: string;
  inputs?: string[];
  outputRef?: string;
  fields?: Record<string, unknown>;
  payloadRef?: string;
  encoding?: string;
  sizeBytes?: number;

  kind?: string;
  chain?: string;
  state?: Record<string, string>;
  metadata?: Record<string, unknown>;
};
```

Trace parsing must validate more than JSON syntax. It must detect:

- Missing required fields.

- Unknown actors and event types.

- Duplicate event IDs or message IDs.

- Duplicate or invalid timestamps.

- Unknown references.

- Values used before they are produced.

- Invalid actor-to-actor routes.

- Invalid state transitions.

- Missing required responses.

- Unsupported schema versions.

- Inconsistent state snapshots.

- Invalid phase assignments.

Validation results must identify the exact line, event, field, error code, severity, and remediation.

```
export type TraceDiagnostic = {
  severity: "error" | "warning" | "info";
  code: string;
  line?: number;
  eventId?: string;
  t?: number;
  field?: string;
  message: string;
  remediation?: string;
};
```

## Required product capabilities

### Import and export

Implement browser-local import for:

- Protocol definition JSON files.

- JSONL trace files.

- JSON trace files where practical.

- Pasted protocol definitions and traces.

- Drag-and-drop files.

The import flow must provide a validation preview before replacing the current workspace. It must allow users to download sample definitions and traces. Export should support sanitized JSONL, protocol definitions, SVG diagrams, and a readable explanation transcript.

### Sequence diagram

The sequence view must support:

- Requests and responses.

- One-way messages.

- Self-messages.

- Broadcast and multicast.

- Protocol phases.

- Loops and repeated exchanges.

- Conditional branches.

- Parallel exchanges.

- Timeouts and retries.

- Dropped, delayed, duplicated, and out-of-order messages.

- Connection open, close, and reset events.

- Expandable message and operation details.

Use consistent visual semantics. For example, distinguish normal delivery, errors, dropped packets, retries, timeouts, and security-sensitive operations through shape, line style, labels, and accessible text—not color alone.

### State-machine view

Add a generic state-machine view in addition to the existing linear timeline. It must render:

- Current state.

- Valid transitions.

- The event that caused a transition.

- Invalid transitions.

- Error and terminal states.

- Reconnection and retry states.

- State-specific explanations.

The timeline should remain useful for evolving values such as ratchet keys, counters, epochs, and connection state. Both views must follow the same derived replay state.

### Message and operation inspector

The inspector must show:

- Sender and receiver.

- Message or operation type.

- Protocol phase.

- Event and message IDs.

- Parent and correlation IDs.

- Timestamp and delivery status.

- Transport metadata.

- Structured fields.

- Encoding and payload size.

- Symbolic inputs and outputs.

- Derived values.

- Authentication and encryption status.

- Related events.

- Human-readable explanation.

- Security and failure impact.

For structured messages, show a tree view that can be expanded to raw or decoded representations. Never display real secrets without an explicit safe-data guarantee.

### Dependency graph

Add a dependency view for inputs, outputs, messages, and derived values. The graph must answer:

- Which operations produced this value?

- Which values were inputs to this operation?

- Which messages depend on this key or token?

- Which later values depend on a compromised value?

- Which values become unavailable after a state transition?

The graph should support selecting a node and navigating to all related events.

### Guided walkthroughs

Each bundled protocol should include a guided walkthrough. The walkthrough must provide:

- A sequence of narrated steps.

- Next, previous, pause, and replay controls.

- Highlighted actors and messages.

- A short explanation for each step.

- A “why this matters” explanation.

- Beginner and expert detail levels where practical.

- Progress tracking.

- Optional comprehension questions.

The walkthrough must be data-driven so that new protocol examples do not require changes to the walkthrough component.

### Protocol verification

Atlas must compare observed traces with protocol definitions. It should report:

- Missing required steps.

- Unexpected steps.

- Invalid ordering.

- Invalid state transitions.

- Missing authentication checks.

- Invalid references.

- Violated invariants.

- Unsupported alternatives.

- Unhandled failure states.

Show verification diagnostics both globally and at the exact event location in the diagram, timeline, state machine, and inspector.

### Failure and transport behavior

Support traces that contain:

- Message loss.

- Message duplication.

- Delay.

- Reordering.

- Retransmission.

- Acknowledgements.

- Timeouts.

- Connection resets.

- Fragmentation and reassembly.

- Skipped message keys.

- Replay attempts.

- Failed authentication.

- Unsupported versions or algorithms.

Do not assume that every protocol is linear or reliable.

### Security and threat overlays

Implement a scenario system that can apply a controlled compromise or network condition to a trace. Initial scenarios should include:

- Passive network observer.

- Malicious server.

- Compromised endpoint.

- Compromised identity key.

- Compromised session or chain key.

- Replay attack.

- Man-in-the-middle attempt.

- Downgrade attempt.

- Lost, delayed, duplicated, or altered message.

The overlay must explain what the attacker can observe, which messages are affected, what remains protected, and when recovery occurs. For ratcheting protocols, it must make forward secrecy and post-compromise recovery visible.

## Live instrumentation and adapters

After the local replay MVP is stable, add a small instrumentation contract and language-specific helpers for TypeScript, Python, Go, Rust, Java, and C or C++ where feasible.

Instrumentation must support:

- Stable event IDs.

- Logical timestamps.

- Correlation IDs.

- Symbolic value references.

- Hashing and redaction.

- Trace session IDs.

- Configurable sampling.

- JSONL output.

- Metadata-only mode.

Provide adapters for real-world inputs in later phases, including PCAP, HAR, browser network exports, WebSocket logs, HTTP logs, gRPC traces, and OpenTelemetry spans. Local processing and sensitive-data protection are mandatory defaults.

## Bundled protocol examples

Build examples incrementally. The first educational set should include:

1. TCP three-way handshake.

1. HTTP request and response.

1. TLS 1.3 handshake.

1. X3DH plus Double Ratchet.

Later examples may include:

- DNS.

- WebSocket upgrade.

- MQTT connect, subscribe, and publish.

- HTTP/2 or HTTP/3.

- Noise XX or NN.

- SSH handshake.

- OAuth 2.0 authorization flow.

- WebAuthn authentication.

- Basic RPC request and response.

- Raft leader election.

Every bundled protocol must include a protocol definition, normal trace, failure trace, explanations, glossary, and documentation links.

## Recommended implementation phases

### Phase 0: Foundation

- Add this `agent.md` file to the repository.

- Create versioned protocol and trace schemas.

- Add runtime validation.

- Refactor replay state into a shared derived-state module.

- Add unit tests for parsing and validation.

- Preserve the current examples while migrating them to the new schema.

### Phase 1: Educational replay MVP

- Add protocol and trace import.

- Add structured message schemas.

- Add protocol phases.

- Add human-readable explanations.

- Improve the inspector.

- Add event search and filters.

- Add a generic state-machine view.

- Add a guided walkthrough.

- Add TCP, HTTP, TLS 1.3, and X3DH + Double Ratchet examples.

### Phase 2: Protocol analysis

- Add expected-versus-actual verification.

- Add conditional branches and alternative flows.

- Add retries, timeouts, and error states.

- Add out-of-order and skipped-message handling.

- Add dependency graphs.

- Add trace comparison.

- Add export and shareable workspace state.

### Phase 3: Live and security analysis

- Add instrumentation SDKs.

- Add safe redaction and trace sanitization.

- Add threat-model overlays.

- Add compromise simulation.

- Add PCAP, HAR, and application-log adapters.

- Add implementation conformance checks.

## Technical requirements

### Testing

Add tests for:

- Protocol schema validation.

- Trace parsing.

- Diagnostic generation.

- Reference resolution.

- State reconstruction.

- State-machine transitions.

- Branches and loops.

- Loss, delay, duplication, and reordering.

- Threat scenarios.

- Keyboard and screen-reader interaction.

- Renderer regressions using stable fixtures.

### Accessibility

Provide:

- Keyboard-selectable events.

- A text event list alongside every diagram.

- Screen-reader labels and descriptions.

- Visible focus states.

- High-contrast mode.

- Reduced-motion mode.

- Color-independent status indicators.

- Mobile-friendly layouts.

- A downloadable text explanation.

### Performance

For large traces, use:

- Indexed trace data.

- Incremental parsing.

- Web Workers for expensive validation.

- Virtualized event lists.

- Lazy inspector details.

- Efficient SVG, Canvas, or hybrid rendering.

- Debounced search and filters.

### Documentation

Maintain documentation for:

- Protocol-definition schema.

- Trace schema.

- Instrumentation contract.

- Adapter development.

- Example authoring.

- Data-safety guarantees.

- Architecture and state reconstruction.

- Contribution and testing instructions.

## Acceptance criteria for the MVP

The MVP is complete only when all of the following are true:

- A user can import a protocol definition and a trace without changing source code.

- Invalid files produce field-level diagnostics with useful remediation text.

- A user can inspect messages, operations, fields, references, and explanations.

- A user can view the same trace as a sequence diagram, timeline, and state machine where applicable.

- A user can search and filter events.

- The application supports at least one non-cryptographic protocol and one cryptographic protocol.

- The application explains each bundled protocol through a guided walkthrough.

- The application can identify at least missing steps, unexpected steps, invalid references, and invalid state transitions.

- Imported traces never require real secrets.

- All primary interactions are keyboard accessible.

- `npm run build` passes.

- Automated tests cover parser, validator, replay, and core interaction behavior.

## Implementation priorities

When choosing between features, use this order:

1. Make protocol and trace data importable and versioned.

1. Make replay state correct and testable.

1. Make messages and state transitions understandable.

1. Make protocol violations visible.

1. Make failure and attack behavior explorable.

1. Add live integrations only after the local-first experience is reliable.

Do not prioritize visual polish over correctness, explainability, validation, and safe data handling.

## Definition of done for new protocol support

A new protocol is not complete when only a diagram has been added. It must provide:

- A versioned protocol definition.

- At least one valid trace.

- At least one invalid or failure trace.

- Actors and roles.

- Phases and messages.

- State variables and transitions where relevant.

- Human-readable explanations.

- Security or reliability properties.

- Failure modes.

- A glossary for protocol-specific terms.

- Documentation references.

- Parser and replay tests.

- A guided walkthrough where the protocol is intended for learning.

## References

[1]: https://github.com/ABHIRAM-CREATOR06/Atlas "Atlas repository"

[2]: https://json-schema.org/ "JSON Schema specification and documentation"

[3]: https://www.rfc-editor.org/rfc/rfc8446 "The Transport Layer Security (TLS ) Protocol Version 1.3"

[4]: https://www.rfc-editor.org/rfc/rfc9293 "Transmission Control Protocol"

[5]: https://www.rfc-editor.org/rfc/rfc9110 "HTTP Semantics"

[6]: https://signal.org/docs/ "Signal protocol documentation"

[7]: https://noiseprotocol.org/noise.html "The Noise Protocol Framework"

---

**Implementation note:** Treat this file as the product and engineering contract for Atlas. Update it when the trace schema, protocol-definition schema, or phased roadmap changes materially.

*Authored by Manus AI.*
