# RuntimeVault Snapshot Inspector

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](https://github.com/giovannesartor/runtimevault-plugin/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![RuntimeVault](https://img.shields.io/badge/powered%20by-RuntimeVault-purple.svg)](https://runtimevault.dev)

Inspect, analyze, and replay production error snapshots directly from your AI coding agent.

## Overview

RuntimeVault captures the complete runtime state the instant an error fires — stack trace, variables, network requests, DOM, storage, and environment metadata. This plugin lets Verboo Code, Claude Code, or any MCP-compatible agent read that evidence, diagnose the root cause, and generate replay commands.

**No more "I can't reproduce this bug."** The full state is frozen and available to your AI.

## Prerequisites

- A **free RuntimeVault account** at [runtimevault.dev](https://runtimevault.dev)
- A project with the **RuntimeVault SDK installed** and capturing snapshots
- An **API key** from your [dashboard settings](https://runtimevault.dev/dashboard/settings)

### SDK setup (5 minutes)

```bash
npm install @runtimevault/core
```

```ts
import { RuntimeVault } from '@runtimevault/core';

RuntimeVault.init({
  apiKey: 'rv_live_xxx',
  environment: 'production',
});
```

Once installed, RuntimeVault automatically captures snapshots on unhandled errors and unhandled promise rejections.

## Setup

### 1. Get your API key

Generate a key at [runtimevault.dev/dashboard/api-keys](https://runtimevault.dev/dashboard/api-keys).

### 2. Set the environment variable

```bash
export RV_API_KEY=rv_live_xxx
```

Or authenticate via the CLI:

```bash
npm install -g @runtimevault/cli
rv login
```

### 3. Install the plugin in Verboo Code

```bash
verboo plugin install runtimevault-snapshot-inspector@verboo-plugins
```

## Commands

### `rv-list`

List recent snapshots from your project.

```
rv-list --limit 10
```

| Output | Description |
|---|---|
| Snapshot ID | First 10 characters of the snapshot |
| Error type | Type of the captured error |
| Error message | Truncated error message |
| Environment | e.g. production, staging |
| Timestamp | When the snapshot was captured |
| Payload flag | Whether full runtime data is available |

---

### `rv-inspect`

Inspect a specific snapshot's full context.

```
rv-inspect snap_9f2a1c
```

Shows all metadata: error, URL, environment, status, session, release, fingerprint, capture time, size, schema version, payload availability, and resolution date if fixed.

---

### `rv-analyze`

Run AI-powered root cause analysis on a snapshot.

```
rv-analyze snap_9f2a1c
```

The analysis engine reads the actual runtime evidence captured at the moment of failure — not just the stack trace. It considers variables in scope, network request/response pairs, storage state, and the event timeline leading up to the error.

**Note:** AI analysis may require an active plan depending on your account tier.

---

### `rv-replay`

Generate a local replay command for a snapshot.

```
rv-replay snap_9f2a1c
```

Outputs the exact `rv replay` command and the full workflow to reproduce the failure environment locally:

```bash
rv login              # authenticate
rv doctor              # check environment
rv replay snap_9f2a1c  # restore runtime state
```

You can also use npx without installing the CLI:

```bash
npx @runtimevault/cli replay snap_9f2a1c
```

## Workflow example

```
1. User reports a bug ──┐
                        ▼
2. RuntimeVault captures snapshot ──┐
                                    ▼
3. Open your AI coding agent
   └─ rv-list              → see recent errors
   └─ rv-inspect snap_xxx  → inspect the failing snapshot
   └─ rv-analyze snap_xxx  → root cause + suggested fix
   └─ rv-replay snap_xxx   → reproduce locally
                                    ▼
4. Fix verified against real runtime state
```

## How it works

The plugin communicates with the [RuntimeVault API](https://api.runtimevault.dev) over HTTPS. All requests are authenticated with your API key. The same evidence visible in the RuntimeVault dashboard is what this plugin reads — no extra instrumentation or configuration needed.

### Security

- **Data masking is applied client-side** before any data leaves the browser. Passwords, tokens, and PII are always redacted.
- **The plugin only reads already-captured snapshots.** It cannot trigger new captures or modify data.
- **API keys are hashed in the database.** The plaintext key is shown exactly once during creation.
- **Source maps are private**, always served through pre-signed URLs.

## Troubleshooting

| Problem | Solution |
|---|---|
| `Authentication required` | Set `RV_API_KEY` or run `rv login` |
| `Snapshot not found` | Verify the snapshot ID. Snapshots expire after 90 days. |
| `AI analysis requires an active plan` | Upgrade at [runtimevault.dev/dashboard/billing](https://runtimevault.dev/dashboard/billing) |
| `API error: 429` | Rate limit exceeded. Wait a few seconds and retry. |
| No snapshots appearing | Ensure the SDK is initialized before errors occur and that `environment` matches your deployment. |

## Development

```bash
git clone https://github.com/giovannesartor/runtimevault-plugin.git
cd runtimevault-plugin
pnpm install
pnpm dev       # watch mode
pnpm build     # production build
```

Each command is a standalone TypeScript file in `src/commands/`. They share the API client at `src/lib/client.ts`. The build compiles each command independently to `commands/` using tsup.

## License

MIT — see [LICENSE](LICENSE).

---

[RuntimeVault](https://runtimevault.dev) · [Dashboard](https://runtimevault.dev/dashboard) · [Docs](https://runtimevault.dev/docs)
