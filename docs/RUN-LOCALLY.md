# Run 戏中人 · TrueMinds locally

5 steps. ~15 min total (incl. local LLM install).

## 1. Prerequisites

- Node.js 20+
- pnpm 9+ (`npm i -g pnpm`)
- A local LLM server — see step 4 (Ollama or LM Studio)

## 2. Clone

```bash
git clone https://github.com/kevin12369/trueminds.git
cd trueminds
```

## 3. Install

```bash
pnpm install
```

## 4. Configure LLM

TrueMinds is a multi-agent text adventure — NPCs are real LLM agents. Install a local LLM server before starting the app.

Pick one:

**Ollama** (recommended):

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.1:8b
ollama serve   # listens on http://localhost:11434
```

**LM Studio** (GUI alternative): download from https://lmstudio.ai, pick a model (e.g. `qwen2.5-coder-7b-instruct`), start the local server on port 1234.

TrueMinds supports 4 local backends out of the box:

| Backend   | Default base URL              | Protocol                  |
|-----------|-------------------------------|---------------------------|
| Ollama    | `http://localhost:11434`      | Ollama native (`/api/generate`) |
| LM Studio | `http://localhost:1234/v1`    | OpenAI-compatible         |
| vLLM      | `http://localhost:8000/v1`    | OpenAI-compatible         |
| llama.cpp | `http://localhost:8080/v1`    | OpenAI-compatible         |

## 5. Run

```bash
pnpm dev
# open http://localhost:3000/trueminds
```

In the app: click ⚙ → Local LLM card → pick provider, paste base URL, fill model name, click "Test connection". When it says "Connected", head back to the tavern and start chatting with the 3 NPCs.

## What you'll see

- 3 NPC avatars in a row (老板娘 / 神秘旅人 / 酒鬼)
- A text input at the bottom; type a line of dialogue and the NPCs reply in their own style
- After turn 5+, the "silver key" plot hook fires and the drunkard reveals a hidden relationship
- All 88 tests pass (`pnpm test` to re-run)
- TypeScript strict (`pnpm -r exec tsc --noEmit`)

## Need help?

- Issues: https://github.com/kevin12369/trueminds/issues
- Email: 491750329@qq.com
- Portfolio: https://kevin12369.github.io/trueminds/portfolio/