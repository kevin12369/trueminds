import { describe, it, expect } from 'vitest';
import { npcAct } from '../src/npc';
import { personaById, getDefaultPersonas } from '../src/persona';
import type { Memory, Message } from '../src/types';

const emptyMemory: Memory = { recentMessages: [], revealedSecrets: [] };
const turn5Memory: Memory = {
  recentMessages: Array.from({ length: 5 }, (_, i) => ({
    speaker: 'player' as const,
    text: `turn ${i}`,
    turn: i,
  })),
  revealedSecrets: [],
};

describe('npcAct', () => {
  it('returns system + user prompt with persona + memory + input', () => {
    const inn = personaById('innkeeper')!;
    const r = npcAct(inn, emptyMemory, 'hello');
    expect(r!.system).toContain(inn.name);
    expect(r!.user).toContain('hello');
  });

  it('includes recent messages in user prompt', () => {
    const inn = personaById('innkeeper')!;
    const r = npcAct(inn, turn5Memory, 'now what?');
    expect(r!.user).toContain('turn 0');
    expect(r!.user).toContain('turn 4');
  });

  it('cold NPC (drunkard) returns null when player has not yet earned trust', () => {
    const drunkard = personaById('drunkard')!;
    // Drunkard is cold — should refuse to engage in the first 5 turns
    const r = npcAct(drunkard, turn5Memory, '你好');
    expect(r).toBeNull();
  });

  it('cold NPC (drunkard) responds after turn 5', () => {
    const drunkard = personaById('drunkard')!;
    const memory: Memory = {
      recentMessages: Array.from({ length: 6 }, (_, i) => ({
        speaker: 'player' as const,
        text: `turn ${i}`,
        turn: i,
      })),
      revealedSecrets: [],
    };
    const r = npcAct(drunkard, memory, '你好');
    expect(r).not.toBeNull();
    expect(r!.system).toContain(drunkard.name);
  });

  it('all 3 personas produce valid prompts (smoke)', () => {
    for (const p of getDefaultPersonas()) {
      const memory: Memory = {
        recentMessages: Array.from({ length: 10 }, (_, i) => ({
          speaker: 'player' as const,
          text: `t${i}`,
          turn: i,
        })),
        revealedSecrets: [],
      };
      const r = npcAct(p, memory, 'hi');
      if (r !== null) {
        expect(r.system.length).toBeGreaterThan(50);
        expect(r.user).toContain('hi');
      }
    }
  });
});
