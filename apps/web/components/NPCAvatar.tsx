import type { NPCState } from '@trueminds/npc';

const STATE_DOT_CLASS: Record<NPCState, string> = {
  friendly: 'bg-emerald-500',
  neutral: 'bg-zinc-500',
  wary: 'bg-amber-500',
  suspicious: 'bg-red-500',
};

export interface NPCAvatarProps {
  id: string;
  name: string;
  emoji: string;
  state: NPCState;
}

export function NPCAvatar({ name, emoji, state }: NPCAvatarProps) {
  return (
    <div className="flex flex-col items-center gap-1" data-testid="npc-avatar">
      <div className="relative">
        <div className="text-5xl leading-none" aria-hidden="true">{emoji}</div>
        <span
          data-testid="npc-status-dot"
          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-zinc-950 ${STATE_DOT_CLASS[state]}`}
          aria-label={`State: ${state}`}
        />
      </div>
      <span className="text-xs text-zinc-300">{name}</span>
    </div>
  );
}
