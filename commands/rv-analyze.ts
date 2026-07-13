import { runtimevault } from '../lib/client';

/**
 * Run AI-powered root cause analysis on a RuntimeVault snapshot.
 *
 * Returns structured analysis: root cause hypothesis, confidence score,
 * and suggested fix grounded in the captured runtime evidence.
 *
 * @example rv-analyze snap_9f2a1c
 */
export async function main(args: { snapshot_id: string }) {
  console.log(`\n  Analyzing snapshot ${args.snapshot_id}...\n`);

  const result = await runtimevault.analyzeSnapshot(args.snapshot_id);

  console.log(`  Root cause:    ${result.root_cause}`);
  console.log(`  Confidence:    ${result.confidence}\n`);
  console.log(`  Suggested fix:\n  ${result.suggested_fix}`);
}
