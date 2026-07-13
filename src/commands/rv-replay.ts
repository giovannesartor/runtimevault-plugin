import { RuntimeVaultClient, RuntimeVaultError } from '../lib/client';

/**
 * Generate a local replay command for a RuntimeVault snapshot.
 *
 * Outputs the `rv replay` command so you can reproduce the exact
 * failure environment locally on your machine.
 *
 * @example rv-replay snap_9f2a1c
 */
export async function main(args: { snapshot_id: string }) {
  if (!args.snapshot_id) {
    console.error('\n  Usage: rv-replay <snapshot_id>');
    return;
  }

  const client = new RuntimeVaultClient();

  try {
    const snap = await client.getSnapshot(args.snapshot_id);
    const cmd = `rv replay ${snap.id}`;

    console.log();
    console.log(`  To reproduce this bug locally, run:\n`);
    console.log(`    ${cmd}\n`);
    console.log(`  Full workflow:\n`);
    console.log(`    1. rv login              # authenticate`);
    console.log(`    2. rv doctor              # check environment`);
    console.log(`    3. ${cmd.padEnd(30)} # restore runtime state`);
    console.log(`    4. rv usage               # check quota`);
    console.log();
    console.log(`  Alternative (no CLI):`);
    console.log(`    npx @runtimevault/cli replay ${snap.id}`);
    console.log();
  } catch (err) {
    if (err instanceof RuntimeVaultError) {
      if (err.status === 404) {
        console.error(`\n  Snapshot '${args.snapshot_id}' not found.`);
      } else {
        console.error(`\n  Error: ${err.message}`);
      }
    } else {
      console.error(`\n  Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
