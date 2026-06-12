import { describe, it, expect } from 'vitest';
import { hooks, fireHook, getHook } from '../src/hooks';

const emptyCtx = {
  playerMessage: '',
  turn: 0,
  memory: { recentMessages: [], revealedSecrets: [] },
};

describe('hooks registry', () => {
  it('hooks contains silver-key', () => {
    expect(hooks.find((h) => h.id === 'silver-key')).toBeDefined();
  });

  it('silver-key does NOT fire before turn 5', () => {
    const h = getHook('silver-key')!;
    expect(h.triggerCondition({ ...emptyCtx, turn: 4, playerMessage: '秘密' })).toBe(false);
  });

  it('silver-key does NOT fire without keyword match', () => {
    const h = getHook('silver-key')!;
    expect(h.triggerCondition({ ...emptyCtx, turn: 10, playerMessage: '你好' })).toBe(false);
  });

  it('silver-key fires at turn >=5 with keyword (Chinese: 秘/钥/银 or English: secret/key)', () => {
    const h = getHook('silver-key')!;
    expect(h.triggerCondition({ ...emptyCtx, turn: 5, playerMessage: '有什么秘密' })).toBe(true);
    expect(h.triggerCondition({ ...emptyCtx, turn: 8, playerMessage: '那把银钥匙' })).toBe(true);
    expect(h.triggerCondition({ ...emptyCtx, turn: 5, playerMessage: 'tell me a secret' })).toBe(true);
    expect(h.triggerCondition({ ...emptyCtx, turn: 5, playerMessage: 'show me the key' })).toBe(true);
  });

  it('fireHook returns drunkard response with isHook: true', () => {
    const ctx = { ...emptyCtx, turn: 5, playerMessage: '秘密' };
    const r = fireHook('silver-key', ctx);
    expect(r).toBeDefined();
    expect(r!.npcId).toBe('drunkard');
    expect(r!.isHook).toBe(true);
  });

  it('fireHook returns undefined when trigger not met', () => {
    const ctx = { ...emptyCtx, turn: 3, playerMessage: '秘密' };
    const r = fireHook('silver-key', ctx);
    expect(r).toBeUndefined();
  });
});
