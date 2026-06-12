import type { Message } from '@trueminds/npc';

export type NPCId = 'innkeeper' | 'traveler' | 'drunkard';

export type HookId = string;

export interface TavernState {
  turn: number;
  messages: Message[];
  activeNpcIds: NPCId[];
  pendingHook: HookId | null;
  triggeredHookIds: HookId[];
  revealedSecretIds: string[];
}

export function createInitialState(): TavernState {
  return {
    turn: 0,
    messages: [],
    activeNpcIds: [],
    pendingHook: null,
    triggeredHookIds: [],
    revealedSecretIds: [],
  };
}

export function addMessage(state: TavernState, message: Message): TavernState {
  return {
    ...state,
    messages: [...state.messages, message],
    turn: state.turn + 1,
  };
}
