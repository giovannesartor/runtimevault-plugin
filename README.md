# RuntimeVault Snapshot Inspector

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](https://github.com/giovannesartor/runtimevault-plugin/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![RuntimeVault](https://img.shields.io/badge/powered%20by-RuntimeVault-purple.svg)](https://runtimevault.dev)

Inspect, analyze, and replay production error snapshots directly from Verboo Code.

## Requirements (read before installing)

**Yes, you need a RuntimeVault account.** This plugin reads snapshots captured by RuntimeVault — there is nothing to inspect if your app doesn't have the SDK installed and sending data.

| Requirement | Why | Cost |
|---|---|---|
| **RuntimeVault account** | The plugin reads from the RuntimeVault API | Free plan available at [runtimevault.dev](https://runtimevault.dev) |
| **SDK in your project** | Only apps with `@runtimevault/core` capture snapshots | Free, open source |
| **API key** | Authenticates the plugin to your account | Generate 1-click in [dashboard](https://runtimevault.dev/dashboard/api-keys) |
| **Snapshots being captured** | Nothing to inspect if no errors have been captured yet | Happens automatically after SDK init |

### What this plugin does NOT do

- ❌ Does **not** capture snapshots — the SDK does that at runtime in your app
- ❌ Does **not** modify or delete any data — read-only
- ❌ Does **not** work without a RuntimeVault account
- ❌ Does **not** replace the RuntimeVault dashboard — it's a complementary interface for your AI agent

### SDK setup (5 minutes)

```
npm install @runtimevault/core
```

```ts
import { RuntimeVault } from '@runtimevault/core';
RuntimeVault.init({
  apiKey: 'rv_live_xxx',
  environment: 'production',
});
```

Once installed, RuntimeVault automatically captures snapshots on unhandled errors and promise rejections.

## Setup

### 1. Create a free account

Sign up at [runtimevault.dev](https://runtimevault.dev) — no credit card required.

### 2. Generate an API key

Go to [runtimevault.dev/dashboard/api-keys](https://runtimevault.dev/dashboard/api-keys) and click **Create key**.

### 3. Set the environment variable

```bash
export RV_API_KEY=rv_live_xxx
```

Or use the CLI instead of an env var:

```bash
npm install -g @runtimevault/cli
rv login
```

### 4. Install the plugin in Verboo Code

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
```

Each command is a standalone TypeScript file in `commands/`. They share the API client at `commands/lib/client.ts`. No build step — the Verboo Code runtime handles TypeScript natively.

## License

MIT — see [LICENSE](LICENSE).

---

[RuntimeVault](https://runtimevault.dev) · [Dashboard](https://runtimevault.dev/dashboard) · [Docs](https://runtimevault.dev/docs)
