# 戏中人 · TrueMinds

> **文字冒险里 NPC 有真魂 / NPCs with real memory, real motives, real reactions**

*🚧 简历 demo 项目,代码待写 — 多 Agent 系统,挺有意思。*

---

## 我为什么做这个 / Why this exists

中文(自白):

我玩文字 RPG(Inworld / AI Dungeon / SillyTavern)老觉得哪儿不对:

**NPC 聊 5 句就开始复读**。你跟酒馆老板说"我欠你钱",他说"嗯,行",你再问"那怎么办",他还说"嗯,行"。

**NPC 跟你说的跟 NPC 跟 NPC 说的对不上**。你说"我爱公主",酒馆老板说"公主是个好人",但**公主本人就在旁边**,公主的反应跟老板描述的不一样。

**NPC 不记得 5 轮前的事**。你给他 3 个线索,他没串起来。Inworld / Convai 商业产品接了 LLM,但**简化到只做"闲聊"**:没有目标,没有关系网,没有剧情一致性。

我想做**真"活"的 NPC**:
- 有自己的目标(复仇/升职/追求某人)
- 跟其他 NPC 有关系(朋友/仇人/恋人)
- 记得你 3 轮前说的(向量记忆)
- 5 步后还记得你第 1 步的伏笔
- 自己的反应要跟"GM 剧情弧"对上

不是"LLM 闲聊"。是**"涌现剧情"**。

English:

Most text-adventure NPCs are LLM-chatrooms that forget in 5 turns.
What if each NPC is an **isolated agent** with persona, memory, hidden goals, and relationships — and your choices ripple 10 turns later?
That's TrueMinds.

---

## 它应该长什么样 / What it should do

我打开网页,看到一个酒馆。3 个 NPC:

- **老板娘** (敏感型): 记得 5 轮前你骂过她,现在躲着你
- **酒鬼** (冷淡型): 懒得搭理你,但你给他钱他才说两句话
- **神秘旅人** (直接型): 给你一把银钥匙(剧情钩子)

我做了 5 轮选择。第 5 步,**酒鬼突然提起老板娘欠他钱**——而你 3 轮前提过这件事,老板娘从来没提。**酒鬼和老板娘是父女,你不知道**(关系网埋的)。

这是涌现剧情。**不是我写的剧本**——是 NPC Agent 自己演出来的。

---

## 技术上会怎么搞 / How it works (planned)

- **前端**: Next.js 15 + SSE 流式(玩家输入 → 多 NPC 并行反应 → 流式回显)
- **后端**: Cloudflare Workers + Durable Objects(每局游戏一个)
- **每 NPC** 是**纯函数 Agent**:
  - 输入: `(input, persona, memory) → output`
  - 没有共享状态,纯函数(易测试)
- **Game Master Agent**: 不调 LLM,纯规则——决定哪些 NPC 响应
- **Consistency Checker**: 下游守门人——检查 NPC 输出是否破设定
- **Storyline Engine**: 状态机(银钥匙剧情钩子在第 3 步埋伏,第 5 步解锁)
- **记忆**:
  - 短期:LRU(最近 N 轮对话)
  - 长期:Vectorize(按语义检索历史片段)
  - 关系:显式图(谁跟谁是父女/仇人/恋人)
- **LLM**: Workers AI / Gemini Flash(免费,角色一致性会差些)/ Claude 3.5 Sonnet(BYOK 升级,角色一致性好)

---

## 有什么挑战 / What'll be hard

1. **角色一致性**。LLM 在长对话里会"漂移"——开始是冷淡的酒鬼,聊 20 轮后变成热心大叔。Plan 里的应对:
   - 短上下文(只喂最近 N 轮)
   - 强 system prompt(每次都重述 persona)
   - Consistency Checker 事后检查
2. **"涌现"和"剧本"平衡**。完全涌现会乱(酒鬼突然讲希腊语),完全剧本会死板。Plan 走**"剧本 + 涌现"**:剧情钩子(银钥匙)我定,NPC 反应涌现。
3. **关系网维护**。3 个 NPC 的关系图可以硬编码,30 个 NPC 时必须自动推断。MVP 只做 3 NPC,但代码得能 scale。
4. **成本**。每 turn 3-5 个 NPC 响应,每响应 ~500 token 输出,Claude Sonnet $15/M output tokens——**单 turn 约 $0.04**。1000 turns/月 = $40。MVP 走免费层够。

---

## 为什么不用现成的(Inworld / Convai / AI Dungeon)

我**看过**这几个。它们的核心问题是**简化的 Agent**:
- 共享聊天历史(没有隔离)
- 单一 system prompt(没有 persona 深度)
- 没有隐藏目标(没有剧情涌现)
- 没有关系网(没有跨 NPC 互动)

TrueMinds 的核心差异:**严格 Agent 隔离 + 关系网 + 剧情一致性检查**。这三点任何商业产品都没做齐(主要是商业化路径太窄)。

代价是:**代码复杂度高,我自己写得很累**。但简历上写出来,跟 Inworld 模板的差距就出来了。

---

## 哪些技术最值得吹

1. **严格 Agent 隔离** — 每个 NPC 是 `act(input, persona, memory) → output` 纯函数。**没共享状态 = 易测试**。Plan 里我会写完整的 isolation test。
2. **多 Agent 架构** — GM + Consistency Checker + Storyline 三个独立 Agent 协作。这不是"LLM 应用",是**分布式 AI 系统设计**。
3. **向量记忆 + 关系网** — 短期/长期记忆分层 + 显式关系图。这是 RAG + GraphRAG 的实战。
4. **剧情一致性** — Consistency Checker 作为下游守门人,这是 5 个项目里**独有的**。

---

## 我从这项目想展示什么 / Resume angle

- **多 Agent 系统设计**: GM + NPC + Consistency 协作
- **RAG + GraphRAG**: 向量记忆 + 关系图
- **状态机 + LLM**: 剧情钩子(银钥匙)由状态机管,NPC 反应由 LLM 涌现
- **测试架构**: 纯函数 Agent 容易 unit test
- **伦理与伦理护栏**: 跟 Sry 一样 3 层关键词 + 真人姓名 + IP 限流

---

## 进度 / Status

- ✅ 设计文档: [docs/design/2026-06-07-ai-npc-text-adventure-design.md](../docs/design/2026-06-07-ai-npc-text-adventure-design.md)
- ✅ 实施计划: [docs/plans/2026-06-07-trueminds-npc-text-adventure-plan.md](../docs/plans/2026-06-07-trueminds-npc-text-adventure-plan.md)
- ⏳ 代码: 0%
- ⏳ Live URL: 待定

---

## 实施完会写什么 / Future dev notes

跑完 deploy 后这里会加:
- Live URL
- 完整的"银钥匙剧情"playthrough(从第 1 步到第 10 步,包括涌现剧情触发点)
- Consistency Checker 真实命中案例(我让 NPC 破设定的测试)
- 多 Agent 协作的 trace(可视化哪个 NPC 何时响应,为什么)
- "10 步后回忆伏笔"的实际演示

---

*P.S. 这 README 写到一半,我老婆问"你写什么呢",我说"AI 文字游戏 NPC",她说"听起来像是要被 AI 取代的客服"——我说"不一样",她说"都一样"——好吧,跟客服不一样。但**跟客服类似的是:多 Agent 系统的核心是"边界清晰"**。客服系统有"问题分类→工单分配→坐席响应→质检"的流程,TrueMinds 也有"NPC 决定谁响应→NPC 响应→Consistency 检查→GM 状态推进"。结构上亲戚,业务上八竿子打不着。*

*P.P.S. 写 README 时顺便想到——如果酒馆老板的女儿是**玩家自己**(loop 自指),那就是另一个 demo 了。**这版不做**,太烧脑。*
