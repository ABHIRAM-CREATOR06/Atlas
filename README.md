# Atlas

**Wireshark for a handshake.**

Most explanations of a cryptographic protocol are prose and static diagrams. Atlas is neither. Point it at a **trace** of a protocol running — a handshake, a ratchet, a session — and it replays the whole thing step by step. Click into a single DH computation. Scrub forward through a conversation and watch forward secrecy actually happen instead of taking it on faith.

Atlas isn't built for one protocol. It's built to visualize *any* cryptographic protocol that can be expressed as a sequence of operations — X3DH, the Double Ratchet, TLS 1.3, Noise, a custom handshake you're designing yourself. Everything protocol-specific lives in a small, swappable **protocol definition**. The core renderer doesn't know or care what protocol it's looking at.

---

## What it shows

### 1. Sequence diagram

N actor swimlanes — however many the protocol needs (Alice/Bob, client/server, Alice/Server/Bob, whatever). Arrows for each message exchanged. Click any arrow to expand the cryptographic operations behind it: DH computations, KDF derivations, signatures, MAC checks — whatever the protocol declares.

For a Signal-style X3DH handshake, that means seeing exactly how

```
DH1 = DH(IK_A, SPK_B)
DH2 = DH(EK_A, IK_B)
DH3 = DH(EK_A, SPK_B)
DH4 = DH(EK_A, OPK_B)   ← if a one-time prekey was consumed
```

feed into the KDF that produces the shared secret — instead of squinting at four DH outputs blurred together in a whitepaper paragraph.

### 2. State timeline

A horizontal scrubber over evolving secret state — for protocols that have it (ratchets, session key rotation, nonce counters, epoch changes). Not every protocol needs this view; the protocol definition decides.

For the Double Ratchet, that means watching root key, sending chain, and receiving chain state evolve message by message, with two visually distinct step types:

- **Symmetric-key ratchet** — cheap, every message, chain key → message key.
- **DH ratchet** — new DH public key arrives, both chains reset. This is forward secrecy, made visible: scrub past a DH ratchet step and watch a previously-compromised message key stop mattering.

---

## Why this exists

It's easy to *know* that a handshake combines several DH outputs, or that a ratchet gives forward secrecy. It's much harder to build real intuition for *which* keys combine into what, or the exact moment a compromised key becomes worthless. Atlas exists to make that concrete instead of conceptual — and, when wired into a real implementation, to actually verify a protocol's behavior against its own security claims rather than just asserting them in documentation.

---

## How it's built

Nothing about a specific protocol is hardcoded. Adding support for a new one means writing a **protocol definition** — a small declaration of:

- `actors` — the swimlanes
- `operationTypes` — the vocabulary of crypto operations this protocol uses
- `stepTypes` — categories of state-mutating step, if it has a timeline view
- `views` — which of sequence diagram / state timeline apply

The bundled reference implementation is **X3DH + Double Ratchet**, built alongside [Halonyx Secura](#), a self-hostable E2EE messaging app implementing the protocol from scratch. It's the worked example — not the ceiling of what Atlas can visualize.

See [`AGENTS.md`](./AGENTS.md) for the full technical contract, trace format, and build phases.

---

## Status

- [ ] **Phase 1 — Static replay.** Fully client-side, ships with the bundled X3DH/Double Ratchet example, no live target system required. *(in progress)*
- [ ] **Phase 2 — Live instrumentation.** Traces generated from a real running system via a minimal JSONL logging shim (any language).
- [ ] **Phase 3 — Threat model overlay.** Animate compromise scenarios directly on the timeline, per-protocol.

---

## Stack

- React + TypeScript + Vite
- D3.js — custom sequence diagram and timeline rendering, not a Mermaid embed, because per-element interactivity is a core requirement
- No backend for Phase 1 — deployable as a static site
- Tokyonight dark theme throughout

---

## Running locally

```bash
git clone <repo-url>
cd atlas
npm install
npm run dev
```

No environment variables, no external accounts, no setup beyond `npm install`. Loads the bundled example protocol + trace automatically.

---

## Trace format

JSON Lines. One protocol event per line, validated against whichever protocol definition is loaded:

```json
{"t": 0, "actor": "alice", "event": "dh_compute", "label": "DH2", "inputs": ["EK_A", "IK_B"], "output_ref": "dh2_hash"}
{"t": 1, "actor": "alice", "event": "kdf_derive", "label": "SK", "inputs": ["dh1_hash", "dh2_hash", "dh3_hash"], "output_ref": "sk_hash"}
{"t": 2, "actor": "alice", "event": "ratchet_step", "kind": "dh", "chain": "root"}
```

Trace files never contain real key material — only truncated hashes or symbolic labels. That makes sample traces safe to commit and safe to attach to a paper appendix, for any protocol.

---

## Instrumenting your own protocol

1. Write a protocol definition describing your actors, operations, and (if relevant) state-timeline step types.
2. Drop a minimal logging shim into your implementation — a handful of call sites at the points where it computes a DH output, derives a key, or transitions state — writing JSONL lines matching the trace format above.
3. Point Atlas at your protocol definition + trace. No core code changes required.

## Known limitations (v1)

- Linear message flow only — out-of-order or skipped messages (which some ratchet-style protocols handle via a skipped-key lookup table) aren't supported yet.
- Bundled traces are static/scripted by default; live instrumentation is Phase 2.

---

## Related

- [Halonyx Secura](#) — the E2EE messaging app the reference protocol definition was built for
