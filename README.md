# 戏中人 · TrueMinds

> **文字冒险 NPC 有真魂 / NPCs that remember, scheme, and react**

[![Tests](https://img.shields.io/badge/tests-88_passing-brightgreen)](#)
[![CI](https://github.com/kevin12369/trueminds/actions/workflows/ci.yml/badge.svg)](https://github.com/kevin12369/trueminds/actions/workflows/ci.yml)
[![Deploy](https://img.shields.io/badge/deploy-live-brightgreen)](https://kevin12369.github.io/trueminds/)

---

## About this project

戏中人 · TrueMinds is a multi-agent text adventure where 3 NPC agents (老板娘 / 神秘旅人 / 酒鬼) each have their own persona, memory, and goals — and a "silver key" plot hook reveals hidden NPC relationships on turn 5+.

See the **[portfolio page](https://kevin12369.github.io/trueminds/portfolio/)** for screenshots, what it does, and how to run it locally.

- **Live demo**: [kevin12369.github.io/trueminds](https://kevin12369.github.io/trueminds/) (preview only — needs your local LLM to actually run)
- **Source code**: [github.com/kevin12369/trueminds](https://github.com/kevin12369/trueminds)
- **Run locally**: [docs/RUN-LOCALLY.md](docs/RUN-LOCALLY.md) — 5 steps, ~15 min

---

## 这个想法

酒馆里 3 个 NPC。聊 5 轮,酒鬼突然提起老板娘欠他钱——你 3 轮前提过,但老板娘从来没提。**酒鬼和老板娘是父女**,这层关系你没在游戏里被告知过。

**涌现剧情,不是我写的剧本**——是 NPC Agent 自己演出来的。

> 不是"LLM 闲聊"。是**有记忆、动机、关系**的 AI 角色。

---

## 这件事有意思在哪

**让虚构角色"活"过来**。

传统文字 RPG 的 NPC 是台词表——5 轮后开始复读。商业 LLM 文字游戏简化了 Agent(共享聊天历史、单 persona),导致 NPC 5 轮复读、不互动、不记得之前。

**这件事想做"活"**——NPC 有自己的目标(复仇/升职/追求某人)、跟其他 NPC 有关系(朋友/仇人/恋人)、记得玩家 3 轮前说过什么、5 步后还能引用第 1 步的伏笔。

更深一层的价值:**让"互动叙事"重新有意思**。电子游戏行业 30 年来互动叙事都是"分支脚本",写死选项——这个项目想做"涌现剧情",选项由 NPC Agent 自己决定,**作者只埋钩子,剧情自己长出来**。

---

## 想要实现的样子

- 玩家打开酒馆,3 个 NPC 各自演一段开场
- 玩家输入:"我欠了老板娘 100 文"
- 老板娘(敏感型,记得之前)响应——她不信任我
- 神秘旅人(直接型)主动给我 5 文——"先还上,剩下的慢慢来"
- 酒鬼(冷淡型,5 轮没说话)突然开口:"我也欠她钱,30 年没还了。"
- **银钥匙触发酒鬼和老板娘的父女关系**——玩家没被告知过

> 3 NPC + 2 段关系 + 1 把钥匙 + 10 轮对话,**涌现出一个 mini 故事**。

---

## 技术栈

| 层级 | 选型 |
|------|------|
| Monorepo | pnpm workspaces(4 pure-TS package + 1 Next.js app) |
| 前端 | Next.js 15(Pages Router, `output: 'export'`,`basePath: '/trueminds'`) |
| 语言 | TypeScript 5.4 strict + `noUncheckedIndexedAccess` |
| 样式 | Tailwind 3.4 |
| 状态图 | `@langchain/langgraph`(GM 编排 turn:GM 节点 → NPC 节点 → Hook 节点) |
| NPC 引擎 | `packages/npc` — `npcAct` 纯函数,`persona` + 3 NPC + 银钥匙 hook |
| Game Master | `packages/gm` — `runTurn(state, playerInput)` 状态图,无 LLM,纯规则 |
| Prompt | `packages/prompt` — 3 NPC 风格(sensitive / direct / cold)模板 |
| LLM 抽象 | `packages/llm` — 6 provider(Workers AI / DeepSeek / Gemini / Anthropic / Ollama / OAI 兼容) |
| 记忆 | LRU 短期记忆(最近 N 轮),localStorage 持久化 |
| 测试 | vitest + jsdom + @testing-library/react |
| 部署 | GitHub Pages(纯静态导出) |

---

## To-do

- [x] 写 monorepo 骨架(pnpm workspace + 4 package + apps/web)
- [x] 写 `packages/npc` — types + 3 default personas + `npcAct` 纯函数
- [x] 写银钥匙 hook(triggers drunkard after turn 5)
- [x] 写 `packages/prompt` — 3 NPC 风格 prompt 模板(sensitive / direct / cold)
- [x] 写 `packages/llm` — 6-provider 抽象(沿用 Hummingbird)
- [x] 写 `packages/gm` — tavern state + `runTurn` graph(GM + NPC + hook 节点)
- [x] 写 `apps/web` Next.js 静态导出骨架
- [x] 写 `useMemory` hook + `useTheme` + `llm-direct`(浏览器直连 LLM)
- [x] 写 `NPCAvatar` 组件(姓名 + emoji + 状态点)
- [x] 写 `DialogueBubble` 组件(玩家右 / NPC 左 / GM 居中)
- [x] 写 `InputBar` 组件(文本输入 + 发送按钮)
- [x] 写 `TavernScene` 组件(3 NPC 头像一排)
- [x] 写 `SettingsModal` + `LocalProviderCard`(主题 + 本地 LLM 配置)
- [x] 写 Home 端到端游戏循环
- [x] 写 README + 88 测试通过(Phase 1)

---

## 欢迎词

开源 + 公开 portfolio。

如果你:

- 跑了一局,NPC 5 轮后开始复读 → 提 issue,贴会话日志
- 发现 NPC 跑偏设定(冷淡的突然热情)→ 提 issue,标 "consistency",**优先修**
- 想让更多 NPC(10+ NPC 大酒馆)→ 提 PR
- 想加剧情弧(多剧情模板)→ 提 PR
- 想用其他 LLM 替换 (Qwen / GLM-4 / DeepSeek)→ 提 PR
- 做相关研究(多 Agent 协作 / RAG / 涌现剧情)→ 发邮件聊合作

提交 issue: [github.com/kevin12369/trueminds/issues](https://github.com/kevin12369/trueminds/issues)
发邮件: 491750329@qq.com

### 特别欢迎

- **多 Agent 系统工程师** — 审 Agent 隔离 + GM 编排
- **RAG / 向量记忆专家** — 优化长期记忆(Phase 2 准备接 Vectorize)
- **互动叙事作者** — 帮我设计更精巧的剧情钩子
- **游戏设计师** — 平衡涌现 vs 剧本

---

## 项目亮点

**做了什么**

- 4 个 pure-TS package(`npc` / `gm` / `prompt` / `llm`)+ 1 个 Next.js 静态导出 app,pnpm workspace 管理
- **3 NPC 性格化 agent** — 老板娘(敏感型)/ 神秘旅人(直接型)/ 酒鬼(冷淡型),各自独立 persona + 风格 prompt,LLM 不会"共享聊天历史"
- **1 把银钥匙剧情钩子** — turn 5 后自动触发酒鬼开口,5 步后还能引用第 1 步的伏笔
- **LRU 短期记忆** — 最近 N 轮对话带 persona 一起喂给 LLM,5 轮后还"记得"3 轮前玩家说的话
- **浏览器直连本地 LLM** — 默认走 Ollama / LM Studio / vLLM / llama.cpp,无后端,无云端转发
- **LangGraph 状态图** — GM 不调 LLM,纯规则决定哪些 NPC 响应;NPC 节点调 LLM 生成发言;Hook 节点按 turn 触发剧情
- **3 NPC 风格 prompt** — sensitive(短句 + 嘲讽)/ direct(主动给信息 + 藏秘密)/ cold(话少 + 5 轮后才开口),严格 JSON 输出
- **6 LLM provider 抽象** — Workers AI / DeepSeek / Gemini / Anthropic / Ollama / OAI 兼容,含 SSRF 防护 + 30s 可调超时
- **主题色 localStorage 持久化** + Theme panel
- **GitHub Pages 静态部署** — `next build` → `apps/web/out/` → 工作流自动发布

**怎么做到的**

- `packages/npc/src/npc.ts` — `npcAct(input, persona, memory)` 纯函数,返回 `{ system, user }` prompt,无副作用
- `packages/npc/src/hooks/silver-key.ts` — `checkTurn(state)` 状态机,turn >= 5 触发酒鬼开口,带剧情伏笔
- `packages/gm/src/graph.ts` — `runTurn(state, playerInput)` LangGraph 状态图,3 节点:GM(决定响应 NPC)→ NPC(并行调 LLM)→ Hook(检查剧情钩子)
- `packages/prompt/src/styles.ts` — 3 NPC 风格 prompt 模板,每个带 persona + 风格 + 记忆 + 输出格式约束
- `packages/llm/` — 沿用 Hummingbird 的 6 provider 抽象,`pickProvider(model, env, local?)` 路由
- `apps/web/lib/llm-direct.ts` — `generateText({ system, user, model, localBaseUrl })` 浏览器直连 Ollama `/api/generate` 或 OAI `/chat/completions`,30s AbortController timeout
- `apps/web/lib/memory.ts` — `useMemory` hook,LRU 缓存最近 10 轮对话,localStorage 持久化
- `apps/web/components/TavernScene.tsx` — 3 NPC 头像一排(emoji + 状态点)
- `apps/web/components/DialogueBubble.tsx` — 玩家发言靠右、NPC 发言靠左、GM 旁白居中
- `apps/web/pages/index.tsx` — 端到端流:玩家输入 → runTurn → LLM 直连 → memory 追加 → 重新渲染

**跑起来的数字**

- **88** 测试通过(npc 16 + gm 7 + prompt 4 + llm 40 + web 21)
- TypeScript strict + `noUncheckedIndexedAccess` 干净
- 3 NPC × 3 prompt 风格 × 6 LLM provider × 4 packages/apps × 1 web app

---

## 本地开发

```bash
git clone https://github.com/kevin12369/trueminds.git
cd trueminds
pnpm install
pnpm dev   # = pnpm --filter @trueminds/web dev, http://localhost:3000/trueminds
```

第一次跑会自动 build 4 个 package。端口 3000,带 `basePath: /trueminds`。

---

## 测试

```bash
pnpm test                          # 88 tests across 4 packages + web app
pnpm -r exec tsc --noEmit          # strict typecheck across all packages
```

测试分布:

| Package | 测试数 |
|---------|--------|
| `@trueminds/npc` | 16 |
| `@trueminds/gm` | 7 |
| `@trueminds/prompt` | 4 |
| `@trueminds/llm` | 40 |
| `@trueminds/web` | 21 |
| **总计** | **88** |

---

## 部署(GitHub Pages)

- 推送到 `main` 即自动部署,工作流在 `.github/workflows/pages.yml`
- 站点 URL: https://kevin12369.github.io/trueminds/
- 一次性配置: GitHub 仓库 Settings → Pages → Source = **GitHub Actions**
- 手动部署: `pnpm --filter @trueminds/web build` → 把 `apps/web/out/` 上传到任意静态主机
- `basePath: '/trueminds'` 已配置,所有静态资源(JS / CSS / 字体)走 `/trueminds/_next/...`

---

## 本地 LLM

默认走**本机 LLM 服务**——对话和 prompt 都不离开你的机器。这种用法下:

- **零云端消耗** — 不吃 Cloudflare / OpenAI / Anthropic 配额
- **隐私** — 对话、persona、记忆、prompt 全在浏览器 + 本机 LLM 之间流转
- **自定义模型** — 用你 fine-tune 过的 LoRA / 量化模型
- **离线可用** — 断网也能用(只要 LLM 服务还跑着)

> Web 部署在 GitHub Pages 上,LLM 调用直接走浏览器到本机 LLM 服务,**不需要后端中转**。

### 支持的本地 backend

| Backend | 默认 baseUrl | 协议 |
|---------|--------------|------|
| [Ollama](https://ollama.com) | `http://localhost:11434` | Ollama 原生 (`/api/generate`) |
| [LM Studio](https://lmstudio.ai) | `http://localhost:1234/v1` | OpenAI 兼容 |
| [vLLM](https://docs.vllm.ai) | `http://localhost:8000/v1` | OpenAI 兼容 |
| [llama.cpp server](https://github.com/ggerganov/llama.cpp) | `http://localhost:8080/v1` | OpenAI 兼容 |

### 快速启动

1. 装好本机 LLM 服务,任选其一:

   ```bash
   # Ollama
   curl -fsSL https://ollama.com/install.sh | sh
   ollama pull llama3.1:8b
   ollama serve    # 监听 http://localhost:11434

   # LM Studio
   # 从 lmstudio.ai 下载,搜索并下载模型,在 Developer 标签点 "Start Server"
   # (默认端口 1234)

   # vLLM
   pip install vllm
   python -m vllm.entrypoints.openai.api_server --model Qwen/Qwen2.5-Coder-7B-Instruct

   # llama.cpp
   ./server -m model.gguf --host 0.0.0.0 --port 8080
   ```

2. 打开 TrueMinds Web → 右上角 **⚙** → **Local LLM** 卡片:
   - 选 Provider(Ollama / OpenAI Compatible)
   - 选/填 Base URL(下拉里给了 4 个常用 preset,不够可以手填)
   - 填 Model 名(你本机装的模型,例如 `llama3.1:8b`)
   - 可选 API Key / Timeout(默认 30s,大型模型可调到 120s)
   - 点 **Test connection**,看到 "Connected" 即通

3. 直接进酒馆聊天——`generateText` 自动读 `trueminds:local:*` 这几个 localStorage key。

### 推荐模型

这些 TrueMinds 实际试过、生成 NPC 风格 prompt 还比较稳的:

- **`llama3.1:8b`** (Ollama) — 通用不错,约 5GB 内存
- **`qwen2.5-coder:7b`** (Ollama) — 代码 / 结构化 JSON 输出最强,约 5GB 内存
- **`deepseek-coder-v2:16b`** (Ollama) — 最强但吃资源,约 10GB 内存
- **`qwen2.5-coder-7b-instruct`** (vLLM / LM Studio) — Ollama 之外的等价选择

不是硬性推荐 — Settings 里 Model 字段是自由文本,你装啥就用啥。

### 注意事项

- **本地不是免费** — 你烧的是 CPU/GPU 时间和电费,不是美元;但云端配额记 0
- **默认 30s 超时** — 小模型够,大模型(16B+)建议调到 60-120s(Settings 里改)
- **baseUrl 仅限 http(s)** — `file://` / `ftp://` 会被 400 挡掉(SSRF 防护)
- **CORS 要在 LLM 服务端放行** — Ollama 默认 `OLLAMA_ORIGINS="*"`,LM Studio 同样,具体看各 backend 文档
- **剧情钩子需多轮触发** — 银钥匙在 turn 5 后才触发,建议至少玩 6-8 轮

---

## 未来可能拓展成什么

- **20+ NPC 联盟** — 关系网自动推断,LLM 涌现更复杂剧情
- **持久世界** — 玩家退出,NPC 继续按自己目标行动(睡眠/工作/恋爱),下次进游戏世界已经变了
- **AI 合作写剧本** — GM 是"剧情设计师 AI",和"玩家"一起决定故事走向(Co-writing)
- **真人 + AI 混合 NPC** — 某些 NPC 是真人扮演,某些是 AI,世界联通
- **剧情编辑器** — 可视化编辑 NPC 关系 / 目标 / 伏笔,生成新剧情
- **多模态 NPC** — 用 ElevenLabs 给 NPC 配声音,用 Inworld 做表情动画
- **Vectorize 长期记忆** — 按语义检索,NPC 记得"3 天前玩家说过的话"

---

> 这项目 Phase 1 代码已经 100% 写完,11 个 task 全部 commit,88 测试通过,GitHub Pages 已部署。Phase 2 计划接 Vectorize 长期记忆 + 多剧情模板 + 10+ NPC 大酒馆。
