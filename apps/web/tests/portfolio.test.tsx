import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Portfolio from '../pages/portfolio';

describe('Portfolio page', () => {
  it('renders the project name + tagline', () => {
    render(<Portfolio />);
    expect(screen.getByRole('heading', { level: 1, name: /TrueMinds/ })).toBeTruthy();
    expect(screen.getByText(/银钥匙钩子的多 Agent/)).toBeTruthy();
  });

  it('renders the screenshot image', () => {
    render(<Portfolio />);
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toContain('main.png');
  });

  it('has a link to RUN-LOCALLY.md', () => {
    render(<Portfolio />);
    const links = screen.getAllByRole('link');
    const runLocally = links.find((l) => /RUN-LOCALLY/i.test(l.getAttribute('href') ?? ''));
    expect(runLocally).toBeTruthy();
    expect(runLocally!.getAttribute('href')).toContain('RUN-LOCALLY');
  });
});