# Atlas

![Atlas Banner](./assets/banner.png)

> **Wireshark for communication protocols with cryptographic depth.**
> 
> *Created by the developer of [Halonyx Secura](https://github.com/ABHIRAM-CREATOR06/Halonyx) — an end-to-end encrypted messenger implementing the Signal Protocol (X3DH + Double Ratchet) from scratch.*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0-green.svg)](https://vitest.dev/)
[![Protocols](https://img.shields.io/badge/Catalog-15%20Protocols-orange.svg)](#bundled-protocols)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ⚡ Overview

Most explanations of network or cryptographic protocols rely on static text and basic sequence diagrams. **Atlas is an interactive execution engine**. Point it at a **JSONL trace** of any protocol — handshakes, key agreement, frame multiplexing, or consensus logs — and Atlas reconstructs and replays the execution step-by-step with state verification, dependency graph analysis, and threat overlays.

Atlas is completely **protocol-agnostic**. Everything protocol-specific lives in declarative **versioned protocol definitions**.

---

## 🎯 Key Capabilities

- 🔍 **Searchable Protocol Catalog**: Explore 15 pre-loaded protocols categorized by pattern (*Transport*, *Application*, *Secure Transport*, *End-to-End Encryption*, *Identity & Authorization*, *Messaging*, *RPC*, *Distributed Systems*) with difficulty levels (*Beginner*, *Intermediate*, *Advanced*).
- ⚖️ **Side-by-Side Comparison Mode**: Compare any two protocols side-by-side across architecture, transport layer requirements, multiplexing, statefulness, security model, and latency trade-offs.
- 🔄 **Interactive Execution Engine**: Sequence diagrams, state timelines with scrubber auto-playback, finite state machines, parameter dependency graphs, and narrated walkthroughs.
- 🛡️ **Threat & Failure Overlays**: Simulate passive eavesdropping, active tampering, key compromise blast-radius analysis, and packet drops/delays.
- 🩺 **Automated Diagnostics**: Multi-pass validator detects missing inputs, unproduced references, illegal state transitions, and out-of-order sequence numbers with actionable remediation instructions.
- 🔒 **Zero-Key Privacy Model**: Operates entirely on symbolic reference IDs and truncated hashes — no private keys or plaintext secrets required. 100% local browser execution.

---

## 🔬 Interactive Views

| View | Description |
| :--- | :--- |
| **Sequence Diagram** | Actor swimlanes with directional message arrows, self-operations, structured field expanders, and cryptographic derivation parameters. |
| **State Timeline** | Scrubber timeline with Play/Pause playback, timestamp stepping, actor state variable cards, and live log updates. |
| **State Machine** | FSM node graph displaying active state highlights, valid/invalid state transitions, and terminal/error states. |
| **Dependency Graph** | Directed graph visualizing key inputs, output derivation lineages, and compromised key blast radius propagation. |
| **Guided Walkthroughs** | Narrated step-by-step educational tours featuring "Why This Matters" insights and comprehension check quizzes. |

---

## 📚 Bundled Protocol Catalog (15 Modules)

Atlas includes 15 fully-featured protocol modules complete with versioned schemas, valid/failure trace datasets, glossaries, and walkthroughs:

| Category | Protocol | Level | Key Focus |
| :--- | :--- | :--- | :--- |
| **End-to-End Encryption** | [X3DH + Double Ratchet](src/data/protocols/x3dh/definition.ts) | `Advanced` | Prekey bundles, DH1-DH4 operations, root/chain key evolution |
| **Transport** | [TCP Three-Way Handshake](src/data/protocols/tcp/definition.ts) | `Beginner` | SYN / SYN-ACK / ACK sequence numbers & connection states |
| **Application** | [HTTP Request & Response](src/data/protocols/http/definition.ts) | `Beginner` | Methods, headers, proxy hop-by-hop forwarding, status codes |
| **Secure Transport** | [TLS 1.3 Handshake](src/data/protocols/tls13/definition.ts) | `Advanced` | 1-RTT KeyShare, Certificate validation, Finished HMAC |
| **Transport** | [DNS Query & Resolution](src/data/protocols/dns/definition.ts) | `Beginner` | Recursive resolution, root/TLD delegation, A/AAAA records |
| **Application** | [WebSocket Protocol](src/data/protocols/websocket/definition.ts) | `Intermediate` | HTTP Upgrade handshake, masked frames, bidirectional data |
| **Messaging** | [MQTT Pub/Sub](src/data/protocols/mqtt/definition.ts) | `Intermediate` | CONNECT handshake, PUBLISH QoS 0/1/2 delivery levels |
| **Application** | [HTTP/2 Binary Framing](src/data/protocols/http2/definition.ts) | `Intermediate` | Stream multiplexing, HEADERS/DATA binary frames, HPACK |
| **Secure Transport** | [QUIC Transport](src/data/protocols/quic/definition.ts) | `Advanced` | UDP multiplexing, 0-RTT/1-RTT handshake, connection migration |
| **Secure Transport** | [Noise Protocol (NN & XX)](src/data/protocols/noise/definition.ts) | `Advanced` | Handshake patterns, static/ephemeral tokens, AEAD payloads |
| **Secure Transport** | [SSH-2 Key Exchange](src/data/protocols/ssh/definition.ts) | `Intermediate` | DH KEX, host key verification, userauth, channel requests |
| **Identity & Auth** | [OAuth 2.0 Auth Code](src/data/protocols/oauth2/definition.ts) | `Intermediate` | PKCE challenge, authorization grant, token exchange |
| **Identity & Auth** | [WebAuthn / FIDO2](src/data/protocols/webauthn/definition.ts) | `Advanced` | Hardware authenticator challenge-response & public keys |
| **RPC** | [gRPC over HTTP/2](src/data/protocols/grpc/definition.ts) | `Intermediate` | Protobuf serialization, length-prefixed framing, streaming |
| **Distributed Systems** | [Raft Consensus](src/data/protocols/raft/definition.ts) | `Advanced` | Leader election, Heartbeat/AppendEntries, quorum log consensus |

---

## 🚀 Quick Start & Local Setup

```bash
# Clone repository
git clone https://github.com/ABHIRAM-CREATOR06/Atlas.git
cd Atlas

# Install dependencies
npm install

# Start local development server
npm run dev

# Run full test suite (Vitest)
npm test

# Build production bundle
npm run build
```

---

## 📝 Trace Format (JSONL)

Atlas reads event traces in single-line JSON (`.jsonl`) format:

```json
{"id": "evt_1", "t": 0, "actor": "Alice", "event": "FetchPrekeyBundle", "phase": "key_agreement", "target": "Bob"}
{"id": "evt_2", "t": 4, "actor": "Alice", "event": "DH", "label": "DH1 (IKa × SPKb)", "inputs": ["ik_alice", "spk_bob"], "output_ref": "dh1_hash"}
{"id": "evt_3", "t": 8, "actor": "Alice", "event": "KDF", "label": "X3DH Master Secret", "inputs": ["dh1_hash", "dh2_hash"], "output_ref": "sk_master"}
```

---

## 📖 Specifications & Reference Docs

- 📄 [Product Specification](docs/agent.md) — Architectural overview & schema definitions
- 🎨 [Design Specification](docs/design.md) — Visual principles, color system & tokens
- 📋 [Trace Format Guide](docs/trace-format.md) — Event trace schema & diagnostic codes
- 🔧 [Protocol Definition Guide](docs/protocol-definition.md) — Authoring guide for custom protocol definitions
- 🛡️ [Security Policy](docs/security.md) — Zero-key logging rules & safe data handling
- 🤝 [Halonyx Secura Repository](https://github.com/ABHIRAM-CREATOR06/Halonyx) — Production Signal Protocol implementation

---

## 📜 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.
