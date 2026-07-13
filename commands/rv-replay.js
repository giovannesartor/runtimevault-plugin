import {
  RuntimeVaultClient,
  RuntimeVaultError
} from "./chunk-JXE2ZZUP.js";

// src/commands/rv-replay.ts
async function main(args) {
  if (!args.snapshot_id) {
    console.error("\n  Usage: rv-replay <snapshot_id>");
    return;
  }
  const client = new RuntimeVaultClient();
  try {
    const snap = await client.getSnapshot(args.snapshot_id);
    const cmd = `rv replay ${snap.id}`;
    console.log();
    console.log(`  To reproduce this bug locally, run:
`);
    console.log(`    ${cmd}
`);
    console.log(`  Full workflow:
`);
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
        console.error(`
  Snapshot '${args.snapshot_id}' not found.`);
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
