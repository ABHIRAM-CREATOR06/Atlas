# Atlas

![Atlas Banner](https://private-us-east-1.manuscdn.com/sessionFile/kBWQ68MWP6QCbpqJoQauNK/sandbox/r9qw827hV3aZ8WWzTTlW8r-images_1789921804526_na1fn_L3RtcC9hdGxhcy1sYXRlc3QvYXNzZXRzL2Jhbm5lcg.png?Expires=1790094608&Signature=MEUCIQDDJX7OupRwvgp8ko4I~kMlNQEKhDaAQNEJWS1go6XKDwIgEXkf3jO7fDAG~W~njXh0dZh65-bu7cqYWTGIe5Sn1Us_&Key-Pair-Id=K1K5N5YNBUUMMN)

> **Wireshark for communication protocols with cryptographic depth.**Atlas is an interactive protocol explainer and trace-analysis application. It reconstructs JSONL protocol traces and replays them through sequence diagrams, state timelines, finite-state machines, dependency graphs, guided walkthroughs, and threat overlays.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff.svg)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-5-green.svg)](https://vitest.dev/)
[![Protocol catalog](https://img.shields.io/badge/catalog-15%20protocols-orange.svg)](#bundled-protocol-catalog)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

Atlas was created by the developer of [Halonyx Secura](https://github.com/ABHIRAM-CREATOR06/Halonyx), an end-to-end encrypted messenger implementing the Signal Protocol from scratch.

## Contents

- [What Atlas does](#what-atlas-does)

- [Current status](#current-status)

- [Core concepts](#core-concepts)

- [Interactive views](#interactive-views)

- [Bundled protocol catalog](#bundled-protocol-catalog)

- [Quick start](#quick-start)

- [Docker deployment](#docker-deployment)

- [Trace format](#trace-format)

- [Protocol definitions](#protocol-definitions)

- [Import and export](#import-and-export)

- [Threat and failure scenarios](#threat-and-failure-scenarios)

- [Privacy model](#privacy-model)

- [Project structure](#project-structure)

- [Adding a protocol](#adding-a-protocol)

- [Testing](#testing)

- [Documentation](#documentation)

- [Known limitations](#known-limitations)

- [Roadmap](#roadmap)

- [Contributing](#contributing)

- [License](#license)

## What Atlas does

Most explanations of network and cryptographic protocols combine specification prose with static diagrams. That makes it difficult to see how values are derived, how state evolves, and what changes when a message is lost or an attacker compromises a value.

Atlas treats a protocol trace as an execution that can be inspected. Given a protocol definition and a JSONL trace, Atlas can:

- Show actors, phases, messages, and operations in sequence.

- Replay state changes with a timestamp scrubber and playback controls.

- Render the protocol as a finite-state machine.

- Trace how inputs produce derived values and messages.

- Explain selected events in plain language.

- Validate references, routes, phases, ordering, and state transitions.

- Compare two protocols across shared characteristics.

- Apply deterministic threat and failure overlays.

- Export a trace, protocol definition, SVG diagram, or Markdown transcript.

Atlas is protocol-agnostic at the rendering layer. Protocol-specific behavior is represented by versioned definitions, trace data, walkthroughs, and scenarios.

## Current status

The latest repository state includes:

- **15 bundled protocol definitions.**

- **Five workspace views:** sequence diagram, state timeline, state machine, dependency graph, and guided walkthrough.

- **Protocol catalog search and filters** by category and difficulty.

- **Side-by-side comparison mode** for protocol characteristics and trade-offs.

- **Local trace preview and import** through the workspace modal.

- **Workspace export** for JSONL traces, protocol JSON, SVG diagrams, and Markdown transcripts.

- **Threat and failure overlays** for bundled scenarios.

- **Structured trace diagnostics** and deterministic replay utilities.

- **Docker and Nginx deployment files.**

- **Cross-platform setup scripts** for Windows and macOS/Linux.

At the verified repository revision, the automated suite contains **11 passing tests**, and the TypeScript/Vite production build completes successfully.

Atlas remains an educational and analysis tool. A bundled protocol module models the declared subset represented by its definition and traces; it is not a replacement for a production protocol implementation, cryptographic library, packet-capture parser, or formal security proof.

## Core concepts

### Protocol definition

A protocol definition declares the actors, phases, messages, operations, state variables, transitions, security properties, failure modes, glossary, and available views for a protocol.

### Trace

A trace is a sequence of JSON objects encoded as JSON Lines. Each event records an action, message, operation, or state change. Traces use symbolic references instead of real private keys or session secrets.

### Replay

The replay layer reconstructs the protocol state at a selected logical timestamp. Views use the same validated event set and selected position so that the sequence diagram, state machine, dependency graph, and inspector remain synchronized.

### Scenario

A scenario applies a deterministic threat or network condition to a trace. It identifies affected events, attacker visibility, preserved properties, and impact without modifying the source trace.

## Interactive views

| View | What it explains |
| --- | --- |
| **Sequence diagram** | Actor swimlanes, directional messages, self-operations, phases, routes, and selected event details. |
| **State timeline** | State variables, timestamp scrubbing, playback, step controls, and cumulative event logs. |
| **State machine** | Protocol states, valid transitions, active state, terminal states, and error states. |
| **Dependency graph** | Input references, derived outputs, provenance, and compromised-value propagation. |
| **Guided walkthrough** | Narrated protocol steps, “Why This Matters” explanations, progress, and comprehension checks. |

The application also provides a contextual inspector, protocol summary, event search, actor and phase filters, diagnostics, and scenario controls.

## Bundled protocol catalog

Atlas currently registers **15 protocol modules** across eight categories.

| Category | Protocol | Level | Main concepts |
| --- | --- | --- | --- |
| End-to-End Encryption | X3DH + Double Ratchet | Advanced | Prekey bundles, DH1–DH4, KDF, root and chain-key evolution |
| Transport | TCP Three-Way Handshake | Beginner | SYN, SYN-ACK, ACK, sequence numbers, connection states |
| Application | HTTP Request & Response | Beginner | Methods, headers, proxy forwarding, status codes, payloads |
| Secure Transport | TLS 1.3 Handshake | Advanced | KeyShare, 1-RTT exchange, certificate validation, Finished HMAC |
| Transport | DNS Query & Resolution | Beginner | Recursive resolution, delegation, A/AAAA records, caching concepts |
| Application | WebSocket Protocol | Intermediate | HTTP Upgrade, masked frames, bidirectional communication |
| Messaging | MQTT Pub/Sub | Intermediate | CONNECT, PUBLISH, subscriptions, QoS 0/1/2 |
| Application | HTTP/2 Binary Framing | Intermediate | Streams, HEADERS/DATA frames, multiplexing, HPACK concepts |
| Secure Transport | QUIC Transport | Advanced | UDP multiplexing, 0-RTT/1-RTT handshake, connection migration |
| Secure Transport | Noise Protocol NN & XX | Advanced | Handshake patterns, static and ephemeral keys, AEAD payloads |
| Secure Transport | SSH-2 Key Exchange | Intermediate | DH key exchange, host-key verification, user authentication, channels |
| Identity & Authorization | OAuth 2.0 Authorization Code | Intermediate | PKCE, authorization grant, token exchange, scopes |
| Identity & Authorization | WebAuthn / FIDO2 | Advanced | Authenticator challenge-response and public-key credentials |
| RPC | gRPC over HTTP/2 | Intermediate | Protobuf serialization, framing, metadata, and streaming |
| Distributed Systems | Raft Consensus | Advanced | Leader election, heartbeats, AppendEntries, quorum log consensus |

Use the catalog filters to search by protocol name, category, difficulty, or tags. Each module declares learning objectives, security properties, failure modes, glossary entries, and documentation references.

## Quick start

### Prerequisites

- Node.js 18 or later.

- npm 9 or later.

- A current browser with JavaScript, ES modules, and SVG support.

### Manual setup

```bash
git clone https://github.com/ABHIRAM-CREATOR06/Atlas.git
cd Atlas
npm install
npm run dev
```

Open the local URL printed by Vite. The development server is configured to bind to `127.0.0.1`.

### Run tests and build

```bash
npm test
npm run build
npm run preview
```

The available package scripts are:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm test` | Run the Vitest suite once. |
| `npm run build` | Type-check and create the production bundle. |
| `npm run preview` | Serve the production bundle locally. |

### Automated setup

The repository includes interactive setup scripts.

On Windows:

```
setup.bat
```

On macOS or Linux:

```bash
chmod +x setup.sh
./setup.sh
```

The script offers development, build-and-test, and Docker deployment modes.

## Docker deployment

The Docker image builds the Vite application and serves the static output through Nginx.

### Docker Compose

```bash
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080).

### Docker CLI

```bash
docker build -t atlas-web .
docker run -d -p 8080:80 --name atlas atlas-web
```

To stop and remove the container:

```bash
docker stop atlas
docker rm atlas
```

The container includes a health check against the Nginx-served application.

## Trace format

Atlas reads UTF-8 JSON Lines files with a `.jsonl` or `.json` extension. Each non-empty line is one JSON object. The trace parser also supports comment lines beginning with `//` or `#`.

A trace event has the following general shape:

```
type TraceEvent = {
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
  status?: "sent" | "received" | "delayed" | "dropped" |
    "duplicated" | "retransmitted" | "failed";
  deliveredAt?: number;

  label?: string;
  inputs?: string[];
  outputRef?: string;
  payloadRef?: string;
  fields?: Record<string, unknown>;
  encoding?: string;
  sizeBytes?: number;

  kind?: string;
  state?: Record<string, string>;
  metadata?: Record<string, unknown>;
};
```

### Example trace

```
{"id":"evt_1","t":0,"actor":"Bob","event":"PublishPrekeys","phase":"setup","outputRef":"bundle_bob_01"}
{"id":"evt_2","t":2,"actor":"Alice","event":"FetchPrekeyBundle","phase":"key_agreement","from":"Alice","to":"Server","target":"Bob","inputs":["bundle_bob_01"]}
{"id":"evt_3","t":4,"actor":"Alice","event":"DH","phase":"key_agreement","label":"DH1 (IKa × SPKb)","inputs":["ik_alice","spk_bob"],"outputRef":"dh1_hash"}
{"id":"evt_4","t":8,"actor":"Alice","event":"KDF","phase":"derivation","label":"X3DH Master Key KDF","inputs":["dh1_hash","dh2_hash"],"outputRef":"sk_master","state":{"rk_a":"rk_a_derived"}}
```

Use symbolic references such as `ik_alice`, `dh1_hash`, and `sk_master` instead of real key material. See [`docs/trace-format.md`](docs/trace-format.md) for the complete field contract and privacy conventions.

### Diagnostics

The validator produces structured diagnostics with severity, code, event or line context, message, and optional remediation. It checks declared actors and event types, timestamps, references, routes, phases, state transitions, and related trace constraints.

## Protocol definitions

A protocol definition is a declarative, versioned description of a protocol. The current schema supports:

- `schemaVersion`, `id`, `name`, `version`, and `category`.

- Difficulty level, tags, description, and documentation URL.

- Learning objectives.

- Actors, roles, and assumptions.

- Phases and message definitions.

- Cryptographic operation types.

- State variables and transitions.

- Invariants.

- Security properties.

- Failure modes.

- Glossary entries.

- Declared views.

The available view IDs are:

```
sequenceDiagram
stateTimeline
stateMachine
dependencyGraph
guidedWalkthrough
```

See [`docs/protocol-definition.md`](docs/protocol-definition.md) for the authoring guide and schema example.

## Import and export

Open the import/export control from the application header.

### Import

The import dialog accepts pasted JSONL trace data and validates it locally before loading the trace into the active workspace. The trace is interpreted against the currently selected protocol definition.

The current implementation exposes a protocol-definition JSON download, but custom protocol definitions are not yet dynamically added to the catalog through the import flow. To add a new protocol to the catalog today, follow the contributor workflow and register it in the source data.

### Export

The export dialog can download:

- Current trace as `.jsonl`.

- Current protocol definition as `.json`.

- Active sequence diagram as `.svg`.

- A readable event transcript as `.md`.

Review exported traces before sharing them. Symbolic identifiers do not automatically guarantee that arbitrary custom fields are safe.

## Threat and failure scenarios

Bundled scenarios are deterministic overlays applied in local component state. They do not permanently modify the source trace.

Scenario categories include network, attacker, compromise, and cryptographic conditions. Depending on the protocol, examples include:

- Passive eavesdropping.

- Active tampering.

- Replay attacks.

- Key compromise and blast-radius analysis.

- Packet drops and delays.

- SYN drop or connection-establishment failure.

- Certificate and authentication failures.

A scenario should communicate:

- What capability or network condition is being applied.

- Which events are affected.

- What the attacker can observe.

- Which properties remain protected.

- What impact the condition has.

- Whether the protocol detects or recovers from it.

## Privacy model

Atlas follows a **zero-key, local-first model**:

- Trace parsing, validation, replay, and rendering occur in the browser.

- The application does not require a backend or external account for local replay.

- Traces should use symbolic references, synthetic identifiers, truncated hashes, or redacted payloads.

- Real private keys, master session secrets, credentials, and raw sensitive plaintext must not be entered or committed.

- Threat scenarios are deterministic local overlays.

- Export should be reviewed for unintended custom fields before distribution.

Atlas is a visualization and analysis tool. It does not guarantee that an imported trace is safe merely because it uses the JSONL format.

## Project structure

```
Atlas/
├── .github/workflows/ci.yml       # Continuous integration workflow
├── assets/banner.png              # Repository banner
├── docs/
│   ├── agent.md                   # Product and implementation specification
│   ├── design.html                # Visual design reference
│   ├── protocol-definition.md     # Protocol authoring guide
│   ├── security.md                # Data safety and privacy policy
│   └── trace-format.md            # JSONL trace specification
├── src/
│   ├── __tests__/                 # Vitest tests and fixtures
│   ├── components/                # React views and UI components
│   ├── data/
│   │   ├── protocols/             # Additional protocol definitions
│   │   ├── protocols.ts            # Catalog assembly and foundational definitions
│   │   ├── scenarios.ts            # Threat and failure scenarios
│   │   ├── traces.ts               # Bundled JSONL traces
│   │   └── walkthroughs.ts         # Guided learning steps
│   ├── lib/
│   │   ├── dependency.ts           # Dependency graph calculations
│   │   ├── replay.ts               # Deterministic replay state
│   │   ├── schema.ts               # Runtime schema helpers
│   │   └── trace.ts                # Parsing and validation
│   ├── App.tsx                    # Application state and view composition
│   ├── main.tsx                   # React entry point
│   ├── styles.css                 # Design system and responsive layout
│   └── types.ts                   # Shared TypeScript contracts
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── setup.bat
├── setup.sh
├── CONTRIBUTING.md
├── LICENSE
├── package.json
└── README.md
```

## Adding a protocol

To add a protocol to the bundled catalog:

1. Create or extend a versioned `ProtocolDefinition`.

1. Add actors, phases, message fields, operations, states, transitions, properties, failure modes, and glossary entries.

1. Add a valid trace to `src/data/traces.ts`.

1. Add at least one failure or threat scenario to `src/data/scenarios.ts`.

1. Add guided walkthrough steps to `src/data/walkthroughs.ts`.

1. Register the definition in `src/data/protocols.ts`.

1. Add tests for parsing, validation, replay, and the protocol’s declared metadata.

1. Add or update the protocol documentation link and learning objectives.

1. Run the test suite and production build.

A complete protocol module should contain normal, failure, and invalid examples where meaningful. It should explain what happened, why the step exists, what it consumes, what it produces, and what happens if it fails.

## Testing

Run the full current test suite with:

```bash
npm test
```

The repository currently includes tests for:

- Trace parsing and validation.

- Valid and invalid trace fixtures.

- Protocol catalog integration.

- Presence of protocol metadata, traces, walkthroughs, and scenarios.

- Basic application smoke behavior.

Build verification is performed with:

```bash
npm run build
```

Before submitting a change, test the affected protocol manually in the browser, including protocol selection, view switching, event inspection, timeline movement, scenario selection, and import/export behavior where applicable.

## Documentation

- [`docs/agent.md`](docs/agent.md) — Product direction, schema contracts, implementation requirements, and roadmap.

- [`docs/design.html`](docs/design.html) — Visual design reference and UI composition reference.

- [`docs/trace-format.md`](docs/trace-format.md) — JSONL event schema and privacy conventions.

- [`docs/protocol-definition.md`](docs/protocol-definition.md) — Protocol-definition schema and authoring workflow.

- [`docs/security.md`](docs/security.md) — Local-first data-safety and zero-key policy.

- [`CONTRIBUTING.md`](CONTRIBUTING.md) — Local development and contribution guidance.

- [Halonyx Secura](https://github.com/ABHIRAM-CREATOR06/Halonyx) — Related Signal Protocol implementation.

## Known limitations

- Custom trace import is interpreted against the currently selected protocol; arbitrary imported protocol definitions are not yet dynamically registered in the catalog.

- Protocol modules model educational traces and declared subsets rather than full production implementations.

- The application does not perform general PCAP decoding.

- The local privacy model depends on users not entering real secrets or unsafe custom fields.

- Threat overlays are deterministic educational scenarios, not complete attack simulators.

- Large traces may require further indexing, virtualization, and incremental rendering work.

- Browser-level testing and deeper protocol conformance testing remain areas for continued development.

## Roadmap

### Near term

- Improve custom protocol-definition loading.

- Expand normal, failure, and invalid trace coverage per module.

- Add richer out-of-order, retry, timeout, and delivery behavior.

- Strengthen browser-level regression tests.

- Improve large-trace performance.

- Add a canonical Markdown design specification alongside the HTML reference.

### Longer term

- Live instrumentation helpers for application implementations.

- Optional HAR, OpenTelemetry, and application-log adapters.

- PCAP-derived trace adapters for selected protocols.

- Trace comparison and expected-versus-actual verification.

- Deeper compromise and recovery analysis.

- Collaborative or hosted workspaces, subject to an explicit privacy model.

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a pull request.

At minimum, run:

```bash
npm install
npm test
npm run build
```

Contributions should preserve the versioned schema contracts, avoid real secrets, include tests for new parsing or replay behavior, document protocol simplifications, and maintain keyboard and responsive behavior.

Use concise commit prefixes such as `feat:`, `fix:`, and `docs:`.

## License

Atlas is distributed under the [MIT License](LICENSE).

## References

[1]: https://github.com/ABHIRAM-CREATOR06/Atlas "Atlas repository"

[2]: https://www.rfc-editor.org/rfc/rfc9293 "Transmission Control Protocol"

[3]: https://www.rfc-editor.org/rfc/rfc9110 "HTTP Semantics"

[4]: https://www.rfc-editor.org/rfc/rfc8446 "The Transport Layer Security (TLS ) Protocol Version 1.3"

[5]: https://signal.org/docs/ "Signal protocol documentation"

[6]: https://www.rfc-editor.org/rfc/rfc1034 "Domain Names — Concepts and Facilities"

[7]: https://www.rfc-editor.org/rfc/rfc6455 "The WebSocket Protocol"

[8]: https://www.rfc-editor.org/rfc/rfc9113 "HTTP/2"

[9]: https://www.rfc-editor.org/rfc/rfc9000 "QUIC: A UDP-Based Multiplexed and Secure Transport"

[10]: https://noiseprotocol.org/noise.html "The Noise Protocol Framework"

[11]: https://www.rfc-editor.org/rfc/rfc4253 "The Secure Shell (SSH ) Transport Layer Protocol"

[12]: https://www.rfc-editor.org/rfc/rfc6749 "The OAuth 2.0 Authorization Framework"

[13]: https://www.w3.org/TR/webauthn-3/ "Web Authentication: An API for accessing Public Key Credentials"

[14]: https://grpc.io/docs/what-is-grpc/introduction/ "gRPC introduction"

[15]: https://raft.github.io/raft.pdf "In Search of an Understandable Consensus Algorithm"

---

**Atlas makes communication behavior visible, inspectable, and explainable.**
