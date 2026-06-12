import type { Message } from '../lib/memory';

const NPC_LABEL: Record<string, string> = {
  innkeeper: '老板娘',
  traveler: '旅人',
  drunkard: '酒鬼',
};

export interface DialogueBubbleProps {
  message: Message;
}

export function DialogueBubble({ message }: DialogueBubbleProps) {
  if (message.speaker === 'gm') {
    return (
      <div
        data-speaker="gm"
        className="self-center italic text-zinc-500 text-sm text-center max-w-md"
      >
        {message.text}
      </div>
    );
  }

  if (message.speaker === 'player') {
    return (
      <div data-speaker="player" className="self-end max-w-[80%]">
        <div className="bg-emerald-700 text-emerald-50 rounded-2xl rounded-tr-sm px-3 py-2 text-sm shadow">
          {message.text}
        </div>
      </div>
    );
  }

  // NPC
  const label = message.npcId ? NPC_LABEL[message.npcId] ?? message.npcId : 'NPC';
  return (
    <div data-speaker="npc" className="self-start max-w-[80%] flex flex-col items-start">
      <span className="text-xs text-zinc-500 ml-2 mb-0.5">{label}</span>
      <div className="bg-zinc-800 text-zinc-100 rounded-2xl rounded-tl-sm px-3 py-2 text-sm shadow">
        {message.text}
      </div>
    </div>
  );
}
