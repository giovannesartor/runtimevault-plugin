import { RuntimeVaultClient, RuntimeVaultError } from './lib/client';

/**
 * Run AI-powered root cause analysis on a RuntimeVault snapshot.
 *
 * The analysis reads the actual runtime evidence captured at the
 * moment of failure — variables, network, storage, and timeline.
 *
 * @example rv-analyze snap_9f2a1c
 */
export async function main(args: { snapshot_id: string }) {
  if (!args.snapshot_id?.trim()) {
    console.error('\n  Usage: rv-analyze <snapshot_id>');
    return;
  }

  const client = new RuntimeVaultClient();

  try {
    console.log(`\n  Analyzing snapshot ${args.snapshot_id}...\n`);

    const result = await client.analyzeSnapshot(args.snapshot_id);

    console.log(result);
    console.log();
  } catch (err) {
    if (err instanceof RuntimeVaultError) {
      if (err.status === 404) {
        console.error(`\n  Snapshot '${args.snapshot_id}' not found.`);
      } else if (err.status === 402) {
        console.error(`\n  AI analysis requires an active plan. Upgrade at https://runtimevault.dev/dashboard/billing`);
      } else {
        console.error(`\n  Error: ${err.message}`);
      }
    } else {
      console.error(`\n  Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
