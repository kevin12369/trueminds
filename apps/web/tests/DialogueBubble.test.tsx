import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DialogueBubble } from '../components/DialogueBubble';
import type { Message } from '../lib/memory';

const playerMsg: Message = { speaker: 'player', text: '你好', turn: 0 };
const npcMsg: Message = { speaker: 'npc', npcId: 'innkeeper', text: '欢迎光临', turn: 0 };
const gmMsg: Message = { speaker: 'gm', text: '酒馆的灯摇曳着', turn: 0 };

describe('DialogueBubble', () => {
  it('renders message text', () => {
    render(<DialogueBubble message={playerMsg} />);
    expect(screen.getByText('你好')).toBeTruthy();
  });

  it('player message aligns to the right', () => {
    const { container } = render(<DialogueBubble message={playerMsg} />);
    const wrapper = container.querySelector('[data-speaker="player"]');
    expect(wrapper?.className).toMatch(/self-end|ml-auto|justify-end|right/);
  });

  it('NPC message aligns to the left and shows NPC id', () => {
    const { container } = render(<DialogueBubble message={npcMsg} />);
    const wrapper = container.querySelector('[data-speaker="npc"]');
    expect(wrapper?.className).toMatch(/self-start|justify-start|left/);
    expect(screen.getByText(/innkeeper|老板娘/)).toBeTruthy();
  });

  it('GM message has a different style (narration)', () => {
    const { container } = render(<DialogueBubble message={gmMsg} />);
    const wrapper = container.querySelector('[data-speaker="gm"]');
    expect(wrapper).toBeTruthy();
    expect(wrapper?.className).toMatch(/italic|center/);
  });
});
