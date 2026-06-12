import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock generateText to avoid network in tests
vi.mock('../lib/llm-direct', () => ({
  generateText: vi.fn().mockResolvedValue({ ok: true, text: '(mocked NPC response)' }),
}));

import Home from '../pages/index';

describe('Home page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders TavernScene with 3 NPC names', () => {
    render(<Home />);
    expect(screen.getByText(/老板娘/)).toBeTruthy();
    expect(screen.getByText(/旅人/)).toBeTruthy();
    expect(screen.getByText(/酒鬼/)).toBeTruthy();
  });

  it('renders InputBar with textbox and send button', () => {
    render(<Home />);
    expect(screen.getByRole('textbox')).toBeTruthy();
    expect(screen.getByRole('button', { name: /send|发送/i })).toBeTruthy();
  });

  it('opens settings modal when gear is clicked', () => {
    render(<Home />);
    // Find the gear button (aria-label "Open settings")
    fireEvent.click(screen.getByRole('button', { name: /open settings/i }));
    expect(screen.getByText(/^theme$/i)).toBeTruthy();
    expect(screen.getByText(/local llm/i)).toBeTruthy();
  });
});
