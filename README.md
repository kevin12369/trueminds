# 戏中人 · TrueMinds

> **文字冒险 NPC 有真魂 / NPCs with memory, motives, relationships**

酒馆里 3 个 NPC。聊 5 轮,酒鬼突然提起老板娘欠他钱——你 3 轮前提过,但老板娘从来没提。**酒鬼和老板娘是父女**,这层关系你没在游戏里被告知过。

涌现剧情,不是我写的剧本——是 NPC Agent 自己演出来的。

*代码待写。Portfolio project; implementation forthcoming.*

---

## Why

商业 LLM 文字游戏(Inworld / Convai / AI Dungeon / SillyTavern)的核心问题是**简化的 Agent**:
- 共享聊天历史(没隔离,5 句就复读)
- 单一 system prompt(persona 浅)
- 没隐藏目标(没剧情涌现)
- 没显式关系网(没跨 NPC 互动)
- 没下游一致性检查(NPC 跑偏没人拦)

TrueMinds 的核心差异:**严格 Agent 隔离 + 关系网 + 一致性检查**。这三点任何商业产品都没做齐(主要是商业化路径太窄,投不起这个量级研发)。

简历上:**多 Agent 系统设计**的工程示例。

---

## Stack

- Next.js 15(前端,SSE 流式)
- Cloudflare Workers(API 编排)+ Durable Objects(每局游戏一个)
- Workers AI / Gemini Flash(默认,免费) / Claude 3.5 Sonnet(BYOK 升级)
- Vectorize(NPC 长期记忆,语义检索)
- D1(关系图 + 剧情状态)

**多 Agent 协作:**
- **NPC Agent × 3**(纯函数 `act(input, persona, memory) → output`,无共享状态)
- **Game Master Agent**(不调 LLM,纯规则——决定哪些 NPC 响应)
- **Consistency Checker**(下游守门人,检查 NPC 输出是否破设定)
- **Storyline Engine**(状态机,管"银钥匙"剧情钩子)

---

## Architecture (planned)

```
Browser (SSE stream)
  ↓ player input
Worker
  ├── Game Master (rule-based: which NPCs respond?)
  ├── For each responding NPC:
  │   ├── fetch memory (Vectorize)
  │   ├── act(input, persona, memory) → output (LLM)
  │   └── Consistency Check (regex + LLM judge)
  ├── Update short-term memory (LRU)
  └── Stream response to browser
Durable Object (per-game state)
  └── Storyline Engine (silver-key arc tracker)
```

---

## Tradeoffs (real)

- **LLM 角色一致性漂移。** 聊 20 轮后,冷淡的酒鬼会变热心大叔。应对:短上下文(最近 5-7 轮) + 强 system prompt(每次重述 persona) + Consistency Checker 兜底。
- **"涌现"和"剧本"平衡。** 完全涌现会乱(酒鬼突然讲希腊语),完全剧本会死板。Plan 走"剧本钩子 + 涌现反应":银钥匙剧情钩子我定,NPC 反应涌现。
- **3 NPC 时关系图能硬编码,30 NPC 时必须自动推断。** MVP 只 3 NPC,代码架构得能 scale。
- **"涌现剧情"质量难以评估。** 没法 A/B 测试"涌现 vs 剧本"哪个体验更好。靠用户反馈迭代。

---

## Run

```bash
pnpm install
pnpm dev:web
pnpm dev:worker
```

---

## Known limitations

- 角色一致性漂移靠 Consistency Checker 事后发现,不能预防
- 涌现剧情不可控(只埋钩子,触发哪个看用户)
- MVP 只 3 NPC,扩到 10+ 时关系图维护和响应选择都要重设计
- 涌现感只能 playthrough 测试,不能 unit test

---

## Explicit non-goals

- No graphics(纯文字 + SSE)
- No account / save(单 anonymous session)
- No NPC 配音
- No multi-language(只中文)
- No "训练自有 NPC 角色"工具
- No 商业 SDK / 开发者平台

---

## Cost

每 turn 3-5 NPC 响应 × ~500 token 输出。Claude Sonnet 单 turn 约 $0.04。

| Usage | Monthly |
|---|---|
| Self | $0(免费层) |
| 100 games/month | $0-5 |
| 1K games/month | $5-30 |
| 10K games/month | $30-200(BYOK 引导) |

---

## Status

- Design: [docs/design/2026-06-07-ai-npc-text-adventure-design.md](../docs/design/2026-06-07-ai-npc-text-adventure-design.md)
- Plan: [docs/plans/2026-06-07-trueminds-npc-text-adventure-plan.md](../docs/plans/2026-06-07-trueminds-npc-text-adventure-plan.md)
- Code: 0% — forthcoming
- Live URL: TBD
