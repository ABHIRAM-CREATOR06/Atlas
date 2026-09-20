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

Atlas comes pre-loaded with complete protocol definitions, valid traces, failure traces, glossaries, and walkthroughs for:

1. **X3DH + Double Ratchet** (Signal E2EE Handshake & Ratchet)
2. **TCP Three-Way Handshake** (SYN, SYN-ACK, ACK connection establishment)
3. **HTTP Request & Response** (GET/POST headers, proxy forwarding, status codes)
4. **TLS 1.3 Handshake** (1-RTT KeyShare, Certificate Verification, Finished HMAC)

---

## Key Features

- **Protocol-Agnostic Core**: Declarative schemas for protocol definitions and JSONL traces.
- **Trace Diagnostics & Verification**: Multi-pass validator checking timestamps, actor declarations, route invalidities, duplicate IDs, missing references, and state transitions with actionable remediation text.
- **Threat Model & Scenario Overlays**: Simulate passive eavesdropping, replay attacks, key compromises, and packet loss/delay.
- **Safe Data Handling**: Built around symbolic references and truncated hashes — never requires real private keys or sensitive plaintexts.
- **Local-First & Accessible**: Runs 100% in the browser with full keyboard navigation, screen-reader support, high contrast, and drag-and-drop file import/export.

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
