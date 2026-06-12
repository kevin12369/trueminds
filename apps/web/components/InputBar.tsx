import { useState, useCallback, type FormEvent } from 'react';

export interface InputBarProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function InputBar({ onSend, disabled = false }: InputBarProps) {
  const [text, setText] = useState('');

  const submit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      const trimmed = text.trim();
      if (!trimmed || disabled) return;
      onSend(trimmed);
      setText('');
    },
    [text, onSend, disabled],
  );

  return (
    <form
      onSubmit={submit}
      className="border-t border-zinc-800 p-3 flex gap-2 bg-zinc-950"
      data-testid="input-bar"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        placeholder="说点什么..."
        className="flex-1 rounded bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
        aria-label="Message input"
      />
      <button
        type="submit"
        disabled={disabled}
        className="rounded bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}
