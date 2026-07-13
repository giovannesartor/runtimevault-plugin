export interface SnapshotListItem {
  id: string;
  error_type: string | null;
  error_message: string | null;
  environment: string | null;
  created_at: string | null;
  status: string | null;
  has_payload: boolean;
  size_bytes: number | null;
}

export interface SnapshotDetail extends SnapshotListItem {
  url: string | null;
  project_id: string | null;
  session_id: string | null;
  schema_version: string | null;
  storage_key: string | null;
  compressed: boolean | null;
  resolved_at: string | null;
  fingerprint: string | null;
  release: string | null;
}

export class RuntimeVaultError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'RuntimeVaultError';
  }
}

export class RuntimeVaultClient {
  private base: string;

  constructor(baseUrl = 'https://api.runtimevault.dev') {
    this.base = baseUrl;
  }

  private token(): string {
    const t = process.env.RV_API_KEY ?? process.env.TC_API_KEY;
    if (!t) throw new RuntimeVaultError('Authentication required. Set RV_API_KEY or run `rv login`.');
    return t;
  }

  private async fetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.base}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.token()}`,
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new RuntimeVaultError(
        (body as Record<string, unknown>).detail as string ?? `API error: ${res.status}`,
        res.status,
      );
    }
    return res.json() as Promise<T>;
  }

  async listSnapshots(limit = 20): Promise<SnapshotListItem[]> {
    return this.fetch<SnapshotListItem[]>(
      `/api/v1/snapshots?limit=${Math.min(limit, 100)}`,
    );
  }

  async getSnapshot(id: string): Promise<SnapshotDetail> {
    return this.fetch<SnapshotDetail>(
      `/api/v1/snapshots/${encodeURIComponent(id)}`,
    );
  }

  async analyzeSnapshot(id: string): Promise<string> {
    const data = await this.fetch<{ result: string }>(
      '/api/v1/ai/analyze-snapshot',
      { method: 'POST', body: JSON.stringify({ snapshot_id: id }) },
    );
    return data.result;
  }
}
