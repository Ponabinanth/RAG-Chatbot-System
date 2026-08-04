const BASE_URL = 'http://127.0.0.1:8000';

function getHeaders(token: string | null, isJson = true) {
  const headers: Record<string, string> = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function apiRegister(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: getHeaders(null),
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<{ id: number; email: string; created_at: string }>(res);
}

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(null),
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<{ access_token: string; token_type: string }>(res);
}

export async function apiGetMe(token: string) {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: getHeaders(token),
  });
  return handleResponse<{ id: number; email: string; created_at: string }>(res);
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

export interface Session {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export async function apiCreateSession(token: string, title = 'New Chat') {
  const res = await fetch(`${BASE_URL}/chat/sessions`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ title }),
  });
  return handleResponse<Session>(res);
}

export async function apiListSessions(token: string) {
  const res = await fetch(`${BASE_URL}/chat/sessions`, {
    headers: getHeaders(token),
  });
  return handleResponse<Session[]>(res);
}

export async function apiGetSession(token: string, sessionId: number) {
  const res = await fetch(`${BASE_URL}/chat/sessions/${sessionId}`, {
    headers: getHeaders(token),
  });
  return handleResponse<Session & { messages: ChatMessage[] }>(res);
}

export async function apiDeleteSession(token: string, sessionId: number) {
  const res = await fetch(`${BASE_URL}/chat/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  return handleResponse<void>(res);
}

export async function apiUpdateSessionTitle(token: string, sessionId: number, title: string) {
  const res = await fetch(`${BASE_URL}/chat/sessions/${sessionId}/title`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify({ title }),
  });
  return handleResponse<{ ok: boolean }>(res);
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export function apiStreamChat(
  token: string,
  sessionId: number,
  message: string,
  useRag = true,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
): AbortController {
  const controller = new AbortController();

  (async () => {
    try {
      const res = await fetch(`${BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ message, session_id: sessionId, use_rag: useRag }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        onError(data.detail || 'Request failed');
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) { onError('No stream reader'); return; }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const dataStr = line.slice(6);
          if (dataStr === '[DONE]') { onDone(); return; }
          try {
            const data = JSON.parse(dataStr);
            if (data.error) { onError(data.error); return; }
            if (data.content) onChunk(data.content);
          } catch { /* skip malformed */ }
        }
      }
      onDone();
    } catch (err: any) {
      if (err.name !== 'AbortError') onError(err.message || 'Network error');
    }
  })();

  return controller;
}

// ─── Documents ────────────────────────────────────────────────────────────────

export interface Document {
  id: number;
  filename: string;
  chunk_count: number;
  created_at: string;
}

export async function apiUploadDocument(token: string, file: File) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE_URL}/documents/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: form,
  });
  return handleResponse<Document>(res);
}

export async function apiListDocuments(token: string) {
  const res = await fetch(`${BASE_URL}/documents`, {
    headers: getHeaders(token),
  });
  return handleResponse<Document[]>(res);
}

export async function apiDeleteDocument(token: string, docId: number) {
  const res = await fetch(`${BASE_URL}/documents/${docId}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  return handleResponse<void>(res);
}
