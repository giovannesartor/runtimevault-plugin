import {
  RuntimeVaultClient,
  RuntimeVaultError
} from "./chunk-JXE2ZZUP.js";

// src/commands/rv-analyze.ts
async function main(args) {
  if (!args.snapshot_id) {
    console.error("\n  Usage: rv-analyze <snapshot_id>");
    return;
  }
  const client = new RuntimeVaultClient();
  try {
    console.log(`
  Analyzing snapshot ${args.snapshot_id}...
`);
    const result = await client.analyzeSnapshot(args.snapshot_id);
    console.log(result);
    console.log();
  } catch (err) {
    if (err instanceof RuntimeVaultError) {
      if (err.status === 404) {
        console.error(`
  Snapshot '${args.snapshot_id}' not found.`);
      } else if (err.status === 402) {
        console.error(`
  AI analysis requires an active plan. Upgrade at https://runtimevault.dev/dashboard/billing`);
      } else {
        console.error(`
  Error: ${err.message}`);
      }
    } else {
      console.error(`
  Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
export {
  main
};
