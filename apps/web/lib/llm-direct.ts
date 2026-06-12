// Browser-side direct LLM call (same pattern as Hummingbird apps/web/lib/llm-direct.ts)
export interface GenerateInput {
  system: string;
  user: string;
  model: 'ollama' | 'openai-compatible';
  localBaseUrl: string;
  localModel: string;
  localApiKey?: string;
  localTimeoutMs?: number;
}

export interface GenerateResult {
  ok: boolean;
  text?: string;
  error?: string;
}

export async function generateText(input: GenerateInput): Promise<GenerateResult> {
  try {
    let text = '';
    if (input.model === 'ollama') {
      text = await callOllama(input);
    } else {
      text = await callOpenAiCompatible(input);
    }
    if (!text) return { ok: false, error: 'Empty response' };
    return { ok: true, text };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

async function callOllama(input: GenerateInput): Promise<string> {
  const url = `${input.localBaseUrl.replace(/\/$/, '')}/api/generate`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), input.localTimeoutMs ?? 30000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: input.localModel,
        prompt: `${input.system}\n\n${input.user}`,
        stream: false,
        options: { temperature: 0.7, num_predict: 200 },
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Ollama ${res.status}: ${await res.text()}`);
    const json = (await res.json()) as { response?: string };
    return json.response ?? '';
  } finally { clearTimeout(timer); }
}

async function callOpenAiCompatible(input: GenerateInput): Promise<string> {
  const url = `${input.localBaseUrl.replace(/\/$/, '')}/chat/completions`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), input.localTimeoutMs ?? 30000);
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (input.localApiKey) headers['Authorization'] = `Bearer ${input.localApiKey}`;
    const res = await fetch(url, {
      method: 'POST', headers,
      body: JSON.stringify({
        model: input.localModel,
        messages: [
          { role: 'system', content: input.system },
          { role: 'user', content: input.user },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`OAI ${res.status}: ${await res.text()}`);
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return json.choices?.[0]?.message?.content ?? '';
  } finally { clearTimeout(timer); }
}
