import type { NPCPrompt, Memory, Persona } from './types';

const COLD_NPC_TURNS_BEFORE_RESPONDING = 5;

export function npcAct(persona: Persona, memory: Memory, playerMessage: string): NPCPrompt | null {
  // Cold NPCs (drunkard) refuse to engage in the first N turns
  if (persona.style === 'cold' && memory.recentMessages.length <= COLD_NPC_TURNS_BEFORE_RESPONDING) {
    return null;
  }

  const system = buildSystemPrompt(persona, memory);
  const user = buildUserPrompt(persona, memory, playerMessage);
  return { system, user };
}

function buildSystemPrompt(persona: Persona, memory: Memory): string {
  const recentTurns = memory.recentMessages.length;
  return `你是${persona.name},${persona.age}岁。${persona.background}

你的说话风格:${persona.speechPattern}

你已经跟玩家聊了 ${recentTurns} 轮。

规则:
- 严格按 persona 说话,不打破角色
- 回应短句为主(1-3 句)
- 不要总结 / 不要解释 / 不要道歉
- 保持你的人物动机和情绪

${persona.style === 'sensitive' ? '- 你对玩家的态度取决于之前的互动;如果不愉快就冷淡' : ''}
${persona.style === 'direct' ? '- 你倾向于主动提供信息和帮助' : ''}
${persona.style === 'cold' ? '- 你话少,不主动开口,只在被直接问时才说' : ''}`;
}

function buildUserPrompt(persona: Persona, memory: Memory, playerMessage: string): string {
  const recentBlock = memory.recentMessages
    .map((m) => {
      if (m.speaker === 'player') return `玩家: ${m.text}`;
      if (m.speaker === 'npc' && m.npcId === persona.id) return `${persona.name}: ${m.text}`;
      if (m.speaker === 'npc' && m.npcId) return `${m.npcId}: ${m.text}`;
      if (m.speaker === 'gm') return `(旁白: ${m.text})`;
      return m.text;
    })
    .join('\n');

  return `最近的对话:
${recentBlock || '(无)'}

玩家刚才说: "${playerMessage}"

请按 persona 风格回应(1-3 句,中文)。`;
}
