// src/lib/client.ts
var RuntimeVaultError = class extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "RuntimeVaultError";
  }
  status;
};
var RuntimeVaultClient = class {
  base;
  constructor(baseUrl = "https://api.runtimevault.dev") {
    this.base = baseUrl;
  }
  token() {
    const t = process.env.RV_API_KEY ?? process.env.TC_API_KEY;
    if (!t) throw new RuntimeVaultError("Authentication required. Set RV_API_KEY or run `rv login`.");
    return t;
  }
  async fetch(path, init) {
    const res = await fetch(`${this.base}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.token()}`,
        "Content-Type": "application/json",
        ...init?.headers
      }
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new RuntimeVaultError(
        body.detail ?? `API error: ${res.status}`,
        res.status
      );
    }
    return res.json();
  }
  async listSnapshots(limit = 20) {
    return this.fetch(
      `/api/v1/snapshots?limit=${Math.min(limit, 100)}`
    );
  }
  async getSnapshot(id) {
    return this.fetch(
      `/api/v1/snapshots/${encodeURIComponent(id)}`
    );
  }
  async analyzeSnapshot(id) {
    const data = await this.fetch(
      "/api/v1/ai/analyze-snapshot",
      { method: "POST", body: JSON.stringify({ snapshot_id: id }) }
    );
    return data.result;
  }
};

export {
  RuntimeVaultError,
  RuntimeVaultClient
};
