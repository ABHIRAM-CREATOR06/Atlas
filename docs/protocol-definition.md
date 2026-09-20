# Atlas Protocol Definition Specification

## Overview

A **Protocol Definition** declaratively describes a communication protocol for Atlas. It defines the actors involved, protocol phases, message structures, cryptographic operation types, state machine transitions, security properties, failure modes, and glossary entries.

## Protocol Definition Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "ProtocolDefinition",
  "type": "object",
  "required": ["schemaVersion", "id", "name", "version", "category", "description", "actors", "phases", "views"],
  "properties": {
    "schemaVersion": { "type": "string", "example": "1.0.0" },
    "id": { "type": "string", "example": "tls13-handshake" },
    "name": { "type": "string", "example": "TLS 1.3 Handshake" },
    "version": { "type": "string", "example": "1.0.0" },
    "category": { "type": "string", "example": "Cryptographic Handshake" },
    "description": { "type": "string" },
    "documentationUrl": { "type": "string" },
    "learningObjectives": { "type": "array", "items": { "type": "string" } },
    "actors": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "label", "color"],
        "properties": {
          "id": { "type": "string" },
          "label": { "type": "string" },
          "color": { "type": "string" },
          "description": { "type": "string" }
        }
      }
    },
    "phases": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "label", "description"],
        "properties": {
          "id": { "type": "string" },
          "label": { "type": "string" },
          "description": { "type": "string" }
        }
      }
    },
    "views": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["sequenceDiagram", "stateTimeline", "stateMachine", "dependencyGraph", "guidedWalkthrough"]
      }
    }
  }
}
```

## Step-by-Step Custom Protocol Authoring

1. **Define Actors**: Specify swimlanes e.g. `Client`, `Server`, `Proxy`.
2. **Define Phases**: Group sequential exchanges e.g. `Setup`, `Key Exchange`, `Data Transfer`.
3. **Declare Messages & Operations**: Define payload parameter fields and plain-language explanations.
4. **Declare State Machine Transitions**: Define `from`, `to`, `event`, and `label` FSM links.
5. **Add Glossaries & Walkthroughs**: Supply plain-language definitions and narrated step tours.
