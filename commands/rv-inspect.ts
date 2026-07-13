import { runtimevault } from '../lib/client';

/**
 * Inspect a specific RuntimeVault snapshot by ID.
 *
 * Shows the full error context, runtime state variables,
 * network requests, storage data, and environment metadata.
 *
 * @example rv-inspect snap_9f2a1c
 */
export async function main(args: { snapshot_id: string }) {
  const snap = await runtimevault.getSnapshot(args.snapshot_id);

  console.log(`\n  Snapshot: ${snap.id}`);
  console.log(`  Error:    ${snap.error_type ?? 'Unknown'} — ${snap.error_message ?? '—'}`);
  console.log(`  URL:      ${snap.url ?? '—'}`);
  console.log(`  Env:      ${snap.environment ?? '—'}`);
  console.log(`  Time:     ${snap.created_at ? new Date(snap.created_at).toLocaleString() : '—'}`);
  console.log(`  Size:     ${snap.size_bytes ? `${(snap.size_bytes / 1024).toFixed(1)} KB` : '—'}`);

  if (snap.has_payload) {
    console.log(`\n  Payload available — use rv-analyze for deeper inspection.`);
  }
}
