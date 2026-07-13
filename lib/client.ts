/**
 * RuntimeVault API client for Verboo Code / Claude Code plugin commands.
 *
 * Uses RV_API_KEY from environment or falls back to TC_API_KEY
 * for backward compatibility. All requests go to api.runtimevault.dev.
 */

const API_URL = process.env.RV_API_URL ?? 'https://api.runtimevault.dev';

function getToken(): string {
  const token =
    process.env.RV_API_KEY ??
    process.env.TC_API_KEY;
  if (!token) {
    throw new Error(
      'Not authenticated. Set RV_API_KEY in your environment, or run `rv login` first.',
    );
  }
  return token;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? `API error: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

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

export interface AnalysisResult {
  root_cause: string;
  confidence: string;
  suggested_fix: string;
}

export const runtimevault = {
  listSnapshots(options: { limit?: number } = {}): Promise<SnapshotListItem[]> {
    const params = new URLSearchParams();
    if (options.limit) params.set('limit', String(options.limit));
    return apiFetch<SnapshotListItem[]>(`/api/v1/snapshots?${params}`);
  },

  getSnapshot(id: string): Promise<SnapshotDetail> {
    return apiFetch<SnapshotDetail>(`/api/v1/snapshots/${encodeURIComponent(id)}`);
  },

  async analyzeSnapshot(id: string): Promise<AnalysisResult> {
    const data = await apiFetch<{ result: string }>('/api/v1/ai/analyze-snapshot', {
      method: 'POST',
      body: JSON.stringify({ snapshot_id: id }),
    });
    return JSON.parse(data.result) as AnalysisResult;
  },
};
