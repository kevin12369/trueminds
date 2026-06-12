export type Speaker = 'player' | 'npc' | 'gm';
export type NPCStyle = 'sensitive' | 'direct' | 'cold';
export type NPCState = 'friendly' | 'neutral' | 'wary' | 'suspicious';

export interface Persona {
  id: string;
  name: string;
  age: number;
  background: string;
  speechPattern: string;
  style: NPCStyle;
  initialState: NPCState;
}

export interface NPC {
  persona: Persona;
  hiddenGoal: string;
}

export interface Message {
  speaker: Speaker;
  npcId?: string;
  text: string;
  turn: number;
}

export interface Memory {
  recentMessages: Message[];
  revealedSecrets: string[];
}

export interface NPCPrompt {
  system: string;
  user: string;
}

export interface HookContext {
  playerMessage: string;
  turn: number;
  memory: Memory;
}

export interface HookResponse {
  npcId: string;
  text: string;
  isHook: true;
}

export interface Hook {
  id: string;
  triggerCondition: (ctx: HookContext) => boolean;
  fire: (ctx: HookContext) => HookResponse;
}
