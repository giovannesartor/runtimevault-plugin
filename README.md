# RuntimeVault Snapshot Inspector

Inspect, analyze, and replay production error snapshots directly from your AI coding agent.

## Overview

RuntimeVault captures the complete runtime state the instant an error fires in your application — stack trace, variables, network requests, DOM, storage, and environment metadata. This plugin lets any Verboo Code or Claude Code-compatible agent read that evidence, diagnose the root cause, and generate replay commands.

No more "I can't reproduce this bug." The full state is frozen, captured, and available to your AI.

## Prerequisites

- A **free RuntimeVault account** at [runtimevault.dev](https://runtimevault.dev)
- A project with the **RuntimeVault SDK installed** and capturing snapshots
- An **API key** from your [dashboard settings](https://runtimevault.dev/dashboard/settings)

The SDK setup takes under 5 minutes:

```bash
npm install @runtimevault/core
```

```ts
import { RuntimeVault } from '@runtimevault/core';
RuntimeVault.init({ apiKey: 'rv_live_xxx' });
```

## Setup

Set your API key in the environment:

```bash
export RV_API_KEY=rv_live_xxx
```

Or authenticate via the CLI:

```bash
npm install -g @runtimevault/cli
rv login
```

## Commands

### `rv-list`

List recent snapshots from your project.

```
rv-list --limit 10
```

Displays error type, message, environment, and capture time for each snapshot.

---

### `rv-inspect`

Inspect a specific snapshot's full context.

```
rv-inspect snap_9f2a1c
```

Shows error details, URL, environment, timestamp, and payload availability.

---

### `rv-analyze`

Run AI-powered root cause analysis on a snapshot.

```
rv-analyze snap_9f2a1c
```

Returns structured analysis:

- **Root cause** — hypothesis grounded in captured runtime state
- **Confidence** — score based on available evidence
- **Suggested fix** — actionable next step

The analysis reads the actual runtime evidence (variables, network, storage, timeline) captured at the moment of failure — it doesn't guess from a stack trace alone.

---

### `rv-replay`

Generate a local replay command for a snapshot.

```
rv-replay snap_9f2a1c
```

Outputs the `rv replay` command and steps to reproduce the exact failure environment locally.

## Workflow example

1. A user reports a bug → RuntimeVault captures the snapshot
2. Open your AI coding agent and run `rv-list` to see recent errors
3. Run `rv-inspect snap_xxx` for the failing snapshot
4. Run `rv-analyze snap_xxx` to get root cause + fix
5. Run `rv-replay snap_xxx` and reproduce locally

## How it works

The plugin communicates with the [RuntimeVault API](https://api.runtimevault.dev) over HTTPS. All data is transmitted securely using your API key. The same evidence you see in the RuntimeVault dashboard is what this plugin reads — no extra instrumentation needed.

Data is masked before it leaves the browser (passwords, tokens, PII are always redacted). The plugin only reads what was already captured.

## About RuntimeVault

RuntimeVault is a runtime state replay platform. When an error occurs, it freezes the entire application state — not just the stack trace, but the variables, network log, DOM, storage, and environment at that exact moment. Developers can then replay that state locally and fix the bug with complete context.

## License

MIT
