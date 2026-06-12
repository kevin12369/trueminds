import { describe, it, expect } from 'vitest';
import { createInitialState, addMessage, type TavernState } from '../src/state';

describe('tavern state', () => {
  it('createInitialState returns turn 0 with empty messages', () => {
    const s = createInitialState();
    expect(s.turn).toBe(0);
    expect(s.messages).toEqual([]);
    expect(s.activeNpcIds).toEqual([]);
    expect(s.triggeredHookIds).toEqual([]);
    expect(s.revealedSecretIds).toEqual([]);
    expect(s.pendingHook).toBeNull();
  });

  it('addMessage appends a message and increments turn', () => {
    const s0 = createInitialState();
    const s1 = addMessage(s0, { speaker: 'player', text: 'hi', turn: 0 });
    expect(s1.messages).toHaveLength(1);
    expect(s1.messages[0]!.turn).toBe(0);
    expect(s1.turn).toBe(1);
  });
});
