# 戏中人 · TrueMinds

> **文字冒险 NPC 有真魂 / NPCs that remember, scheme, and react**

[![Status](https://img.shields.io/badge/status-design--ready-yellow)](#)
[![License](https://img.shields.io/badge/license-MIT-blue)](#)
[![Stack](https://img.shields.io/badge/stack-Cloudflare_Workers-F38020?logo=cloudflare)](#)

---

## ✨ 这个想法

酒馆里 3 个 NPC。聊 5 轮,酒鬼突然提起老板娘欠他钱——你 3 轮前提过,但老板娘从来没提。**酒鬼和老板娘是父女**,这层关系你没在游戏里被告知过。

**涌现剧情,不是我写的剧本**——是 NPC Agent 自己演出来的。

> 💡 不是"LLM 闲聊"。是**有记忆、动机、关系**的 AI 角色。

---

## 🎯 这件事有意思在哪

**让虚构角色"活"过来**。

传统文字 RPG 的 NPC 是台词表——5 轮后开始复读。商业 LLM 文字游戏简化了 Agent(共享聊天历史、单 persona),导致 NPC 5 轮复读、不互动、不记得之前。

**这件事想做"活"**——NPC 有自己的目标(复仇/升职/追求某人)、跟其他 NPC 有关系(朋友/仇人/恋人)、记得玩家 3 轮前说过什么、5 步后还能引用第 1 步的伏笔。

更深一层的价值:**让"互动叙事"重新有意思**。电子游戏行业 30 年来互动叙事都是"分支脚本",写死选项——这个项目想做"涌现剧情",选项由 NPC Agent 自己决定,**作者只埋钩子,剧情自己长出来**。

### 🔬 有意思的技术点

- 🔒 严格 Agent 隔离(纯函数,易测试)
- 🤝 多 Agent 协作(GM + Consistency + Storyline)
- 🧠 向量记忆 + 关系网
- 🛡️ 剧情一致性检查(下游守门人)

---

## 🚀 想要实现的样子

- 🎬 玩家打开酒馆,3 个 NPC 各自演一段开场
- 💬 玩家输入:"我欠了老板娘 100 文"
- 😠 老板娘(敏感型,记得之前)响应——她不信任我
- 🤝 神秘旅人(直接型)主动给我 5 文——"先还上,剩下的慢慢来"
- 🍶 酒鬼(冷淡型,5 轮没说话)突然开口:"我也欠她钱,30 年没还了。"
- 🔑 **银钥匙触发酒鬼和老板娘的父女关系**——玩家没被告知过

> 🎯 3 NPC + 2 段关系 + 1 把钥匙 + 10 轮对话,**涌现出一个 mini 故事**。

---

## 🔮 未来可能拓展成什么

- **👥 多 NPC 联盟**:20+ NPC,关系网自动推断,LLM 涌现更复杂剧情
- **🌍 持久世界**:玩家退出,NPC 继续按自己目标行动(睡眠/工作/恋爱),下次进游戏世界已经变了
- **✍️ AI 合作写剧本**:GM 是"剧情设计师 AI",和"玩家"一起决定故事走向(Co-writing)
- **🎭 真人 + AI 混合 NPC**:某些 NPC 是真人扮演,某些是 AI,世界联通
- **🛠️ 剧情编辑器**:可视化编辑 NPC 关系 / 目标 / 伏笔,生成新剧情
- **🎬 多模态 NPC**:用 ElevenLabs 给 NPC 配声音,用 Inworld 做表情动画

---

## 🛠️ 技术栈

| 层级 | 选型 |
|------|------|
| 🎨 前端 | Next.js 15(SSE 流式响应) |
| ☁️ 后端 | Cloudflare Workers(API 编排)+ **Durable Objects(每局游戏一个)** |
| 🤖 多 Agent | NPC Agent × N(纯函数)/ Game Master(纯规则)/ Consistency Checker / Storyline Engine |
| 🤖 LLM | Workers AI / Gemini Flash(免费)/ Claude 3.5 Sonnet(BYOK 升级,角色一致性好) |
| 🧠 记忆 | 短期:LRU(最近 N 轮)/ 长期:Vectorize(按语义检索)/ 关系:显式图 |

### 🤖 Agent 架构细节

- **NPC Agent × N** — 纯函数 `act(input, persona, memory) → output`,无共享状态
- **Game Master Agent** — 不调 LLM,纯规则——决定哪些 NPC 响应
- **Consistency Checker** — 下游守门人,检查 NPC 输出是否破设定
- **Storyline Engine** — 状态机,管银钥匙剧情钩子

---

## 📋 To-do

- [ ] 写 Next.js 前端 + SSE 流式
- [ ] 写 Durable Object 包装(每局游戏一个,跨 turn 状态)
- [ ] 写 NPC Agent 纯函数架构 + isolation 测试
- [ ] 写 Game Master Agent(纯规则,无 LLM)
- [ ] 写 Consistency Checker(规则 + LLM judge)
- [ ] 写 Storyline Engine 状态机(银钥匙剧情钩子)
- [ ] 写 Vectorize 长期记忆(按语义检索)
- [ ] 写关系图(显式,跨 NPC 互动)
- [ ] 写 3 NPC + 1 剧情(银钥匙 MVP)
- [ ] 写 deploy 脚本
- [ ] 写 README polish(完整 playthrough demo)

---

## 🤝 欢迎词

开源 + 公开 portfolio。

如果你:

- 🔁 **跑了一局,NPC 5 轮后开始复读** → 提 issue,贴会话日志
- 🎭 **发现 NPC 跑偏设定**(冷淡的突然热情)→ 提 issue,标 "consistency",**优先修**
- 👥 **想让更多 NPC**(10+ NPC 大酒馆)→ 提 PR
- 📖 **想加剧情弧**(多剧情模板)→ 提 PR
- 🔄 **想用其他 LLM 替换** (Qwen / GLM-4 / DeepSeek)→ 提 PR
- 🔬 **做相关研究**(多 Agent 协作 / RAG / 涌现剧情)→ 发邮件聊合作

**提交 issue**:[github.com/kevin12369/trueminds/issues](https://github.com/kevin12369/trueminds/issues)
**发邮件**:491750329@qq.com

### 💡 特别欢迎

- 🤖 多 Agent 系统工程师(审 Agent 隔离 + GM 编排)
- 🧠 RAG / 向量记忆专家(优化 Vectorize 集成)
- ✍️ 互动叙事作者(帮我设计更精巧的剧情钩子)
- 🎮 游戏设计师(平衡涌现 vs 剧本)

---

> *代码还没写。设计 + 实施计划 100% 完整。5 个项目里**最工程味重**的一个,估 1-2 周。*
