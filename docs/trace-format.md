# Atlas Trace Format Specification

## Overview

Atlas trace files use **JSON Lines (JSONL)** format, where each line represents a single discrete event in a protocol execution trace. Trace events are strictly local-first and must never contain real private keys, session secrets, or raw sensitive plaintexts.

## File Format

- **File extension**: `.jsonl` or `.json`
- **Encoding**: UTF-8
- **Structure**: One valid JSON object per line. Lines starting with `//` or `#` are ignored.

## Trace Event Schema

```typescript
export type TraceEvent = {
  schemaVersion?: string;   // e.g. "1.0.0"
  id: string;               // Unique event identifier e.g. "evt_101"
  t: number;                // Logical integer timestamp e.g. 0, 1, 2...
  wallTime?: string;        // Optional ISO 8601 wall clock timestamp
  actor: string;            // Actor ID performing or recording the event
  event: string;            // Declared message or operation event name
  phase?: string;           // Declared protocol phase ID

  from?: string;            // Source actor ID for network messages
  to?: string;              // Recipient actor ID for network messages
  messageType?: string;     // High-level message type identifier
  messageId?: string;       // Unique message identifier for correlation
  correlationId?: string;  // Parent/request message ID being acknowledged

  sequence?: number;        // TCP/Protocol sequence number
  transport?: string;       // Transport layer protocol e.g. "TCP", "UDP", "TLS"
  status?: "sent" | "received" | "delayed" | "dropped" | "duplicated" | "retransmitted" | "failed";

  label?: string;           // Human-readable diagram label
  inputs?: string[];        // Array of symbolic reference IDs consumed as input
  outputRef?: string;       // Symbolic reference ID produced as output
  payloadRef?: string;      // Symbolic reference ID for encrypted payload
  fields?: Record<string, unknown>; // Structured payload parameters

  kind?: string;            // Event classification e.g. "state", "crypto", "message"
  state?: Record<string, string>; // Actor state variable mutations
  metadata?: Record<string, unknown>;
};
```

## Example Trace Lines

```json
{"id": "evt_1", "t": 0, "actor": "Bob", "event": "PublishPrekeys", "phase": "setup", "output_ref": "bundle_bob_01"}
{"id": "evt_2", "t": 2, "actor": "Alice", "event": "FetchPrekeyBundle", "phase": "key_agreement", "from": "Alice", "to": "Server", "target": "Bob", "inputs": ["bundle_bob_01"]}
{"id": "evt_3", "t": 4, "actor": "Alice", "event": "DH", "phase": "key_agreement", "label": "DH1 (IKa × SPKb)", "inputs": ["ik_alice", "spk_bob"], "output_ref": "dh1_hash"}
{"id": "evt_4", "t": 8, "actor": "Alice", "event": "KDF", "phase": "derivation", "label": "X3DH Master Key KDF", "inputs": ["dh1_hash", "dh2_hash"], "output_ref": "sk_master", "state": {"rk_a": "rk_a_derived"}}
```

## Privacy & Safety Conventions

1. **Symbolic References**: Represent key material using symbolic strings like `ik_alice_99a`, `spk_bob_11b`, `sk_master_77c`.
2. **Redacted Payloads**: Use truncated hashes or placeholders like `ct_msg1_redacted`.
3. **Zero Secret Leaks**: Atlas enforces local-first execution. Traces can be safely committed to source control or shared for security reviews.
