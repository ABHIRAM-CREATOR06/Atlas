# Atlas Data Safety & Privacy Policy

## Core Safety Principles

Atlas is designed from the ground up for **safe protocol visualization and local trace inspection**.

### 1. 100% Local-First Browser Replay
- All trace parsing, validation, state reconstruction, and diagram rendering happen **entirely inside your local browser runtime**.
- No trace payloads, network headers, or imported protocol definitions are ever transmitted to an external server or analytics service.

### 2. Zero Private Key Policy
- Atlas **never accepts or processes real private keys**, master session secrets, or raw unencrypted sensitive payloads.
- Protocol traces must use **symbolic references** (e.g. `ik_alice_99a`, `dh1_hash`), truncated hashes, or synthetic identifiers.

### 3. Threat Model Simulation Safety
- Threat scenarios (such as passive eavesdropping, replay attacks, or key compromises) are calculated deterministically via scenario masks in local component state.
- Scenario simulations never modify your underlying source files or store permanent unencrypted artifacts.

### 4. Sanitized Trace Export
- The export module sanitizes traces before downloading to ensure no unintended field data is exposed outside the browser workspace.
