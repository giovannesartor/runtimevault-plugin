import {
  RuntimeVaultClient,
  RuntimeVaultError
} from "./chunk-JXE2ZZUP.js";

// src/commands/rv-list.ts
async function main(args) {
  const client = new RuntimeVaultClient();
  const limit = Number(args.limit) || 20;
  try {
    const snapshots = await client.listSnapshots(limit);
    if (snapshots.length === 0) {
      console.log("No snapshots found for this project.");
      return;
    }
    console.log(`
  Found ${snapshots.length} snapshot(s):
`);
    for (const snap of snapshots) {
      const time = snap.created_at ? new Date(snap.created_at).toLocaleString() : "\u2014";
      const msg = (snap.error_message ?? "").slice(0, 80);
      console.log(
        `  ${snap.id.slice(0, 10)}  ${snap.error_type ?? "Unknown".padEnd(16)}  ${msg}`
      );
      console.log(`  ${" ".repeat(12)}${snap.environment ?? "\u2014"}  ${time}`);
      if (snap.has_payload) console.log(`  ${" ".repeat(12)}payload available`);
      console.log();
    }
  } catch (err) {
    if (err instanceof RuntimeVaultError) {
      console.error(`
  Error: ${err.message}`);
    } else {
      console.error(`
  Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
export {
  main
};
