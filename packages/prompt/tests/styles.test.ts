import { describe, it, expect } from 'vitest';
import { STYLE_PROMPTS, getStylePrompt } from '../src/styles';

describe('style prompts', () => {
  it('STYLE_PROMPTS has 3 styles (sensitive, direct, cold)', () => {
    expect(Object.keys(STYLE_PROMPTS)).toHaveLength(3);
    expect(STYLE_PROMPTS).toHaveProperty('sensitive');
    expect(STYLE_PROMPTS).toHaveProperty('direct');
    expect(STYLE_PROMPTS).toHaveProperty('cold');
  });

  it('each style prompt is non-empty and > 30 chars', () => {
    for (const [name, prompt] of Object.entries(STYLE_PROMPTS)) {
      expect(prompt.length, `${name} prompt`).toBeGreaterThan(30);
    }
  });

  it('getStylePrompt returns matching prompt', () => {
    expect(getStylePrompt('sensitive')).toContain(STYLE_PROMPTS.sensitive.slice(0, 30));
    expect(getStylePrompt('cold')).toContain(STYLE_PROMPTS.cold.slice(0, 30));
  });

  it('getStylePrompt throws for unknown style', () => {
    expect(() => getStylePrompt('neutral' as any)).toThrow();
  });
});
