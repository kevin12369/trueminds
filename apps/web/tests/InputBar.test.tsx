import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputBar } from '../components/InputBar';

describe('InputBar', () => {
  it('renders textbox and send button', () => {
    render(<InputBar onSend={() => {}} />);
    expect(screen.getByRole('textbox')).toBeTruthy();
    expect(screen.getByRole('button', { name: /send|发送/i })).toBeTruthy();
  });

  it('calls onSend with trimmed text and clears input on submit', () => {
    const onSend = vi.fn();
    render(<InputBar onSend={onSend} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '  你好  ' } });
    fireEvent.click(screen.getByRole('button', { name: /send|发送/i }));
    expect(onSend).toHaveBeenCalledWith('你好');
    expect(input.value).toBe('');
  });

  it('does not call onSend when input is empty', () => {
    const onSend = vi.fn();
    render(<InputBar onSend={onSend} />);
    fireEvent.click(screen.getByRole('button', { name: /send|发送/i }));
    expect(onSend).not.toHaveBeenCalled();
  });

  it('disables input and button when disabled prop is true', () => {
    render(<InputBar onSend={() => {}} disabled />);
    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: /send|发送/i }) as HTMLButtonElement).disabled).toBe(true);
  });
});
