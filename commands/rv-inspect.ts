import { RuntimeVaultClient, RuntimeVaultError } from './lib/client';

/**
 * Inspect a specific RuntimeVault snapshot by ID.
 *
 * @example rv-inspect snap_9f2a1c
 */
export async function main(args: { snapshot_id: string }) {
  if (!args.snapshot_id?.trim()) {
    console.error('\n  Usage: rv-inspect <snapshot_id>');
    return;
  }

  const client = new RuntimeVaultClient();

  try {
    const snap = await client.getSnapshot(args.snapshot_id);

    console.log();
    console.log(`  Snapshot ID:   ${snap.id}`);
    console.log(`  Error:         ${snap.error_type ?? 'Unknown'} — ${snap.error_message ?? '—'}`);
    console.log(`  URL:           ${snap.url ?? '—'}`);
    console.log(`  Environment:   ${snap.environment ?? '—'}`);
    console.log(`  Status:        ${snap.status ?? 'open'}`);
    console.log(`  Session:       ${snap.session_id ?? '—'}`);
    console.log(`  Release:       ${snap.release ?? '—'}`);
    console.log(`  Fingerprint:   ${snap.fingerprint ?? '—'}`);
    console.log(`  Captured at:   ${snap.created_at ? new Date(snap.created_at).toLocaleString() : '—'}`);
    console.log(`  Size:          ${snap.size_bytes ? `${(snap.size_bytes / 1024).toFixed(1)} KB` : '—'}`);
    console.log(`  Schema:        ${snap.schema_version ?? '—'}`);
    console.log(`  Payload:       ${snap.has_payload ? 'yes (use rv-analyze)' : 'no'}`);
    if (snap.resolved_at) {
      console.log(`  Resolved at:   ${new Date(snap.resolved_at).toLocaleString()}`);
    }
    console.log();
  } catch (err) {
    if (err instanceof RuntimeVaultError) {
      console.error(`\n  Error: ${err.message}`);
    } else {
      console.error(`\n  Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
