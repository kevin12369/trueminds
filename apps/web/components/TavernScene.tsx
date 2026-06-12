import { NPCAvatar } from './NPCAvatar';
import type { NPCState } from '@trueminds/npc';

interface TavernNPC {
  id: string;
  name: string;
  emoji: string;
  state: NPCState;
}

const TAVERN_NPCS: TavernNPC[] = [
  { id: 'innkeeper', name: '老板娘', emoji: '🍶', state: 'wary' },
  { id: 'traveler', name: '旅人', emoji: '🧳', state: 'friendly' },
  { id: 'drunkard', name: '酒鬼', emoji: '🍺', state: 'neutral' },
];

export function TavernScene() {
  return (
    <div
      className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800 px-4 py-6"
      data-testid="tavern-scene"
    >
      <div className="max-w-3xl mx-auto flex justify-around items-end">
        {TAVERN_NPCS.map((npc) => (
          <NPCAvatar key={npc.id} id={npc.id} name={npc.name} emoji={npc.emoji} state={npc.state} />
        ))}
      </div>
    </div>
  );
}
