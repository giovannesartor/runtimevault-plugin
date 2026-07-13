import { RuntimeVaultClient, RuntimeVaultError } from './lib/client';

/**
 * List recent RuntimeVault snapshots from your project.
 *
 * @example rv-list --limit 5
 */
export async function main(args: { limit?: string }) {
  const client = new RuntimeVaultClient();
  const limit = Number(args.limit) || 20;

  try {
    const snapshots = await client.listSnapshots(limit);

    if (snapshots.length === 0) {
      console.log('No snapshots found for this project.');
      return;
    }

    console.log(`\n  Found ${snapshots.length} snapshot(s):\n`);
    for (const snap of snapshots) {
      const time = snap.created_at
        ? new Date(snap.created_at).toLocaleString()
        : '—';
      const msg = (snap.error_message ?? '').slice(0, 80);
      console.log(
        `  ${snap.id.slice(0, 10)}  ${snap.error_type ?? 'Unknown'.padEnd(16)}  ${msg}`,
      );
      console.log(`  ${' '.repeat(12)}${snap.environment ?? '—'}  ${time}`);
      if (snap.has_payload) console.log(`  ${' '.repeat(12)}payload available`);
      console.log();
    }
  } catch (err) {
    if (err instanceof RuntimeVaultError) {
      console.error(`\n  Error: ${err.message}`);
    } else {
      console.error(`\n  Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
