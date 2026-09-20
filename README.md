# Atlas

![Atlas Banner](./assets/banner.png)

**Wireshark for communication protocols with cryptographic depth.**

Most explanations of a cryptographic or network protocol are prose and static diagrams. Atlas is neither. Point it at a **trace** of a protocol running — a handshake, a ratchet, an HTTP exchange, a TCP connection — and it replays the whole thing step by step with rich visual interactivity and automated protocol verification.

Atlas isn't built for one protocol. It's built to visualize *any* communication protocol that can be expressed declaratively — X3DH, Double Ratchet, TLS 1.3, TCP 3-way handshake, HTTP request/response flows, Noise, or a custom protocol you're designing yourself. Everything protocol-specific lives in a versioned **protocol definition**.

---

## What It Shows

### 1. Sequence Diagram
Actor swimlanes (Alice/Bob, Client/Server, Client/Proxy/Server). Directional arrows for each message and self-operation. Click any arrow to expand structured fields, cryptographic parameters (DH computations, HKDF derivations, signature checks), and state changes.

### 2. State Timeline
A horizontal scrubber with Play/Pause auto-playback, timestamp stepping, actor state variable cards, and cumulative event logs.

### 3. Generic State-Machine View
Finite state machine nodes and transition triggers, displaying active state highlights, valid/invalid transitions, and terminal/error states.

### 4. Dependency Graph
Visual node-link directed graph illustrating parameter inputs, output references, operation derivations, and compromised value propagation (blast radius analysis).

### 5. Guided Walkthroughs
Interactive narrated tours for bundled protocols with step navigation, progress tracking, "Why this matters" callouts, and comprehension check quizzes.

---

## Bundled Protocols

Atlas features a searchable 15-protocol catalog categorized by transport, application, security, messaging, RPC, and consensus patterns:

1. **X3DH + Double Ratchet** (*End-to-End Encryption*) — Signal prekey bundles, DH operations, and root/chain key evolution.
2. **TCP Three-Way Handshake** (*Transport*) — SYN, SYN-ACK, ACK sequence synchronization and TCP state transitions.
3. **HTTP Request & Response** (*Application*) — Headers, method semantics, proxy forwarding, and response status codes.
4. **TLS 1.3 Handshake** (*Secure Transport*) — 1-RTT KeyShare exchange, certificate verification, and HMAC Finished messages.
5. **DNS Query & Resolution** (*Transport*) — Recursive resolver query, root/TLD delegation, A/AAAA records, and caching.
6. **WebSocket Protocol** (*Application*) — HTTP/1.1 Upgrade handshake, masked frames, ping/pong, and bidirectional data.
7. **MQTT Pub/Sub Messaging** (*Messaging*) — Broker CONNECT, PUBLISH QoS levels (0/1/2), and subscriber topic filtering.
8. **HTTP/2 Binary Framing** (*Application*) — Stream multiplexing, HEADERS/DATA binary frames, and HPACK header compression.
9. **QUIC Encrypted Transport** (*Secure Transport*) — UDP-based transport, 0-RTT/1-RTT handshake, and connection ID migration.
10. **Noise Protocol Framework (NN & XX)** (*Secure Transport*) — Dynamic DH patterns, static/ephemeral handshake tokens, and payload AEAD.
11. **SSH-2 Key Exchange** (*Secure Transport*) — Diffie-Hellman KEX, host key validation, userauth, and channel session request.
12. **OAuth 2.0 Authorization Code Flow** (*Identity & Authorization*) — PKCE code challenge, authorization grant, token exchange, and API request.
13. **WebAuthn / FIDO2 Authentication** (*Identity & Authorization*) — Public key credential creation, challenge-response signature, and authenticator data.
14. **gRPC over HTTP/2** (*RPC*) — Protocol Buffers binary wire format, gRPC length-prefixed framing, and bidirectional streaming.
15. **Raft Consensus Protocol** (*Distributed Systems*) — Leader election, term validation, Heartbeat/AppendEntries, and quorum log replication.

---

## Key Features

- **Searchable Protocol Catalog**: Category pills, difficulty badges (*Beginner*, *Intermediate*, *Advanced*), learning objectives, and tag-based search.
- **Side-by-Side Protocol Comparison Mode**: Compare two protocols across architectural patterns, transport dependencies, security properties, state complexity, and latency trade-offs.
- **Protocol-Agnostic Core Engine**: Declarative schemas for versioned protocol definitions, trace parsing, state transition tracking, and execution graphs.
- **Trace Diagnostics & Automated Verification**: Multi-pass validator checking timestamps, actor declarations, route invalidities, duplicate IDs, missing references, and state transitions with actionable remediation text.
- **Threat Model & Scenario Overlays**: Simulate passive eavesdropping, replay attacks, key compromises, and packet loss/delay.
- **Safe Data Handling**: Built around symbolic references and truncated hashes — never requires real private keys or sensitive plaintexts.
- **Local-First & Accessible**: Runs 100% in the browser with full keyboard navigation, screen-reader support, high contrast, and drag-and-drop file import/export.

---

## Documentation & References

- [Product Specification](docs/agent.md) — Product vision, non-negotiable principles, and schema specifications.
- [Design Specification](docs/design.md) — Visual principles, color system, and layout rules.
- [Design Reference HTML](docs/design.html) — HTML/CSS reference implementation.
- [Trace Format Specification](docs/trace-format.md) — JSONL trace schema, fields, and privacy standards.
- [Protocol Definition Guide](docs/protocol-definition.md) — Guide for authoring custom protocol definitions.
- [Security & Data Safety](docs/security.md) — Privacy policy and zero-key logging rules.
- [Contributing Guide](CONTRIBUTING.md) — Development setup, testing, and contribution instructions.

---

## Stack

- React 19 + TypeScript + Vite
- D3.js — custom sequence diagram & visualization rendering
- Vitest — automated unit testing engine
- Minimal professional design system (light canvas, warm neutral surfaces, blue accent)

---

## Running Locally

```bash
# Clone the repository
git clone https://github.com/ABHIRAM-CREATOR06/Atlas.git
cd Atlas

# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests
npm test

# Build for production
npm run build
```

---

## Trace Format

JSON Lines format (one event per line):

```json
{"id": "evt_1", "t": 0, "actor": "Alice", "event": "FetchPrekeyBundle", "phase": "key_agreement", "target": "Bob"}
{"id": "evt_2", "t": 4, "actor": "Alice", "event": "DH", "label": "DH1 (IKa × SPKb)", "inputs": ["ik_alice", "spk_bob"], "output_ref": "dh1_hash"}
{"id": "evt_3", "t": 8, "actor": "Alice", "event": "KDF", "label": "X3DH Master Secret", "inputs": ["dh1_hash", "dh2_hash"], "output_ref": "sk_master"}
```

---

## License

[MIT](LICENSE)
