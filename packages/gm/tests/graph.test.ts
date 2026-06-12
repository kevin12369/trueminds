import { describe, it, expect } from 'vitest';
import { runTurn } from '../src/graph';
import { createInitialState } from '../src/state';

describe('runTurn', () => {
  it('processes a player turn and returns updated state + NPC prompts', async () => {
    const s0 = createInitialState();
    const r = await runTurn(s0, '你好');
    // graph.ts only adds the player message to state; NPC responses are
    // produced by the Web layer calling the LLM, then appended to memory.
    expect(r.state.messages).toHaveLength(1);
    expect(r.npcPrompts.length).toBeGreaterThan(0);
  });

  it('first player message selects traveler (direct style) to respond', async () => {
    const s0 = createInitialState();
    const r = await runTurn(s0, '你好');
    // Active NPC should include traveler (direct = friendly initial state)
    expect(r.state.activeNpcIds).toContain('traveler');
  });

  it('player mentioning "secret" at turn 5 sets pendingHook to silver-key', async () => {
    let s = createInitialState();
    for (let i = 0; i < 5; i++) {
      const r = await runTurn(s, `turn ${i}`);
      s = r.state;
    }
    const r = await runTurn(s, '有什么秘密?');
    expect(r.state.pendingHook).toBe('silver-key');
  });

  it('player mentioning "secret" at turn 4 does NOT trigger hook (turn < 5)', async () => {
    let s = createInitialState();
    for (let i = 0; i < 3; i++) {
      const r = await runTurn(s, `turn ${i}`);
      s = r.state;
    }
    const r = await runTurn(s, '有什么秘密?');
    expect(r.state.pendingHook).toBeNull();
  });

  it('cold NPC (drunkard) does NOT appear in activeNpcIds for first 5 turns', async () => {
    let s = createInitialState();
    for (let i = 0; i < 4; i++) {
      const r = await runTurn(s, `turn ${i}`);
      s = r.state;
    }
    expect(s.activeNpcIds).not.toContain('drunkard');
  });
});
