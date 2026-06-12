import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMemory, type Message } from '../lib/memory';

const sampleMessages: Message[] = [
  { speaker: 'player', text: 'hi', turn: 0 },
  { speaker: 'npc', npcId: 'innkeeper', text: 'hello', turn: 0 },
  { speaker: 'player', text: 'how are you?', turn: 1 },
];

describe('useMemory', () => {
  beforeEach(() => localStorage.clear());

  it('starts with empty memory', () => {
    const { result } = renderHook(() => useMemory());
    expect(result.current.messages).toEqual([]);
  });

  it('adds a message and trims to LRU size (default 10)', () => {
    const { result } = renderHook(() => useMemory());
    act(() => result.current.addMessage({ speaker: 'player', text: 't0', turn: 0 }));
    for (let i = 1; i < 15; i++) {
      act(() => result.current.addMessage({ speaker: 'player', text: `t${i}`, turn: i }));
    }
    expect(result.current.messages).toHaveLength(10);
    expect(result.current.messages[0]!.text).toBe('t5'); // oldest 5 dropped
  });

  it('clear() resets memory', () => {
    const { result } = renderHook(() => useMemory());
    act(() => result.current.addMessage(sampleMessages[0]!));
    act(() => result.current.clear());
    expect(result.current.messages).toEqual([]);
  });

  it('addMessage stores in localStorage', () => {
    const { result } = renderHook(() => useMemory());
    act(() => result.current.addMessage(sampleMessages[0]!));
    const stored = JSON.parse(localStorage.getItem('trueminds:memory:v1')!);
    expect(stored.messages).toHaveLength(1);
  });
});
