import { runtimevault } from '../lib/client';

/**
 * List recent RuntimeVault snapshots from your project.
 *
 * Displays error type, message, environment, and capture time
 * for the last 20 snapshots. Requires RV_API_KEY or `rv login`.
 *
 * @example rv-list --limit 5
 */
export async function main(args: { limit?: number }) {
  const limit = Math.min(args.limit ?? 20, 100);
  const snapshots = await runtimevault.listSnapshots({ limit });

  if (snapshots.length === 0) {
    console.log('No snapshots found for this project.');
    return;
  }

  console.log(`\n  Recent snapshots (${snapshots.length}):\n`);
  for (const snap of snapshots) {
    const env = snap.environment ?? '—';
    const time = snap.created_at
      ? new Date(snap.created_at).toLocaleString()
      : '—';
    console.log(
      `  ${snap.error_type ?? 'Error'.padEnd(16)} ` +
        `${(snap.error_message ?? '').slice(0, 60).padEnd(62)} ` +
        `${env.padEnd(12)} ${snap.id.slice(0, 10)} ${time}`,
    );
  }
}
