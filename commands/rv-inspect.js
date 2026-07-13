import {
  RuntimeVaultClient,
  RuntimeVaultError
} from "./chunk-JXE2ZZUP.js";

// src/commands/rv-inspect.ts
async function main(args) {
  if (!args.snapshot_id) {
    console.error("\n  Usage: rv-inspect <snapshot_id>");
    return;
  }
  const client = new RuntimeVaultClient();
  try {
    const snap = await client.getSnapshot(args.snapshot_id);
    console.log();
    console.log(`  Snapshot ID:   ${snap.id}`);
    console.log(`  Error:         ${snap.error_type ?? "Unknown"} \u2014 ${snap.error_message ?? "\u2014"}`);
    console.log(`  URL:           ${snap.url ?? "\u2014"}`);
    console.log(`  Environment:   ${snap.environment ?? "\u2014"}`);
    console.log(`  Status:        ${snap.status ?? "open"}`);
    console.log(`  Session:       ${snap.session_id ?? "\u2014"}`);
    console.log(`  Release:       ${snap.release ?? "\u2014"}`);
    console.log(`  Fingerprint:   ${snap.fingerprint ?? "\u2014"}`);
    console.log(`  Captured at:   ${snap.created_at ? new Date(snap.created_at).toLocaleString() : "\u2014"}`);
    console.log(`  Size:          ${snap.size_bytes ? `${(snap.size_bytes / 1024).toFixed(1)} KB` : "\u2014"}`);
    console.log(`  Schema:        ${snap.schema_version ?? "\u2014"}`);
    console.log(`  Payload:       ${snap.has_payload ? "yes (use rv-analyze)" : "no"}`);
    if (snap.resolved_at) {
      console.log(`  Resolved at:   ${new Date(snap.resolved_at).toLocaleString()}`);
    }
    console.log();
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
