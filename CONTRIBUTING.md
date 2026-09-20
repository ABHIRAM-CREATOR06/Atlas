# Contributing to Atlas

Thank you for your interest in contributing to Atlas! We welcome contributions for protocol definitions, trace validators, visualizers, documentation, and tests.

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Setup & Local Development

```bash
# 1. Clone the repository
git clone https://github.com/ABHIRAM-CREATOR06/Atlas.git
cd Atlas

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run automated test suite
npm test

# 5. Build for production
npm run build
```

## Repository Structure

```
Atlas/
├── docs/                      # Canonical documentation
│   ├── agent.md               # Agent & Product specification
│   ├── design.md              # Design system specification
│   ├── design.html            # Static HTML design reference
│   ├── trace-format.md        # Trace JSONL reference
│   ├── protocol-definition.md # Protocol schema guide
│   └── security.md            # Data safety & privacy policy
├── src/
│   ├── __tests__/             # Unit and smoke test suite
│   ├── components/            # React visualization & UI components
│   ├── data/                  # Bundled protocols, traces, walkthroughs, scenarios
│   ├── lib/                   # Parsing, validation, replay, dependency engines
│   └── types.ts               # Core TypeScript interface contracts
└── package.json
```

## Adding a New Protocol Definition

1. Create a versioned `ProtocolDefinition` entry in [`src/data/protocols.ts`](file:///c:/Users/abhir/OneDrive/Documents/GitHub/Atlas/src/data/protocols.ts).
2. Provide valid and failure JSONL traces in [`src/data/traces.ts`](file:///c:/Users/abhir/OneDrive/Documents/GitHub/Atlas/src/data/traces.ts).
3. Add interactive walkthrough steps in [`src/data/walkthroughs.ts`](file:///c:/Users/abhir/OneDrive/Documents/GitHub/Atlas/src/data/walkthroughs.ts).
4. Add threat model scenarios in [`src/data/scenarios.ts`](file:///c:/Users/abhir/OneDrive/Documents/GitHub/Atlas/src/data/scenarios.ts).
5. Add parser & validator tests in [`src/__tests__/trace.test.ts`](file:///c:/Users/abhir/OneDrive/Documents/GitHub/Atlas/src/__tests__/trace.test.ts).

## Pull Request Guidelines

- Ensure `npm test` passes cleanly with 100% test coverage for new parsing/validation code.
- Ensure `npm run build` succeeds without TypeScript or bundling warnings.
- Keep commits concise and descriptive (`feat:`, `fix:`, `docs:`, `style:`).
