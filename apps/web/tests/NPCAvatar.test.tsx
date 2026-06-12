import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NPCAvatar } from '../components/NPCAvatar';

describe('NPCAvatar', () => {
  it('renders NPC name', () => {
    render(<NPCAvatar id="innkeeper" name="老板娘" emoji="🍶" state="neutral" />);
    expect(screen.getByText('老板娘')).toBeTruthy();
  });

  it('renders emoji avatar', () => {
    render(<NPCAvatar id="traveler" name="旅人" emoji="🧳" state="friendly" />);
    expect(screen.getByText('🧳')).toBeTruthy();
  });

  it('renders status dot with state class', () => {
    const { container } = render(<NPCAvatar id="drunkard" name="酒鬼" emoji="🍺" state="wary" />);
    const dot = container.querySelector('[data-testid="npc-status-dot"]');
    expect(dot).toBeTruthy();
    expect(dot?.className).toMatch(/bg-amber/);
  });
});
