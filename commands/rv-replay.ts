import { runtimevault } from '../lib/client';

/**
 * Generate a replay command for a RuntimeVault snapshot.
 *
 * Copies the `rv replay <snapshot_id>` command to your clipboard
 * so you can reproduce the exact failure locally.
 *
 * @example rv-replay snap_9f2a1c
 */
export async function main(args: { snapshot_id: string }) {
  const snap = await runtimevault.getSnapshot(args.snapshot_id);
  const cmd = `rv replay ${snap.id}`;

  console.log(`\n  Replay command:\n`);
  console.log(`    ${cmd}\n`);
  console.log(`  Steps:\n`);
  console.log(`    1. rv login          # authenticate`);
  console.log(`    2. rv doctor          # diagnose environment`);
  console.log(`    3. ${cmd}  # reproduce the bug`);
}
