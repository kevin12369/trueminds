import { createInitialState, addMessage, type TavernState, type NPCId } from './state';
import { getDefaultPersonas, npcAct, hooks, getHook, type HookContext, type HookResponse, type NPCPrompt } from '@trueminds/npc';

export interface TurnResult {
  state: TavernState;
  npcPrompts: NPCPrompt[];
  hookResponse: HookResponse | null;
}

const ALL_NPC_IDS: NPCId[] = ['innkeeper', 'traveler', 'drunkard'];

/**
 * Selects which NPCs respond to a given player message.
 * Phase 1 heuristic:
 *   - Traveler (direct) is friendly and always responds
 *   - Innkeeper (sensitive) responds if not too early
 *   - Drunkard (cold) responds only after turn 5
 * Phase 2 can replace this with a GM LLM call.
 */
function selectActiveNpcs(state: TavernState, _playerMessage: string): NPCId[] {
  const active: NPCId[] = [];
  if (state.turn >= 0) active.push('traveler'); // always
  if (state.turn >= 1) active.push('innkeeper'); // after player has spoken
  if (state.turn >= 5) active.push('drunkard'); // cold NPC, after threshold
  return active;
}

function checkHookTriggers(ctx: HookContext): string | null {
  for (const hook of hooks) {
    if (hook.triggerCondition(ctx) && !ctx.memory.revealedSecrets.includes(hook.id)) {
      return hook.id;
    }
  }
  return null;
}

export async function runTurn(
  initialState: TavernState,
  playerMessage: string,
): Promise<TurnResult> {
  // Step 1: add player message
  let state = addMessage(initialState, {
    speaker: 'player',
    text: playerMessage,
    turn: initialState.turn,
  });

  // Step 2: select active NPCs
  const activeNpcIds = selectActiveNpcs(state, playerMessage);
  state = { ...state, activeNpcIds };

  // Step 3: build NPC prompts (the Web layer will call LLM for each)
  const personas = getDefaultPersonas();
  const npcPrompts: NPCPrompt[] = [];
  for (const npcId of activeNpcIds) {
    const persona = personas.find((p) => p.id === npcId);
    if (!persona) continue;
    const memory = {
      recentMessages: state.messages.slice(-10),
      revealedSecrets: state.revealedSecretIds,
    };
    const prompt = npcAct(persona, memory, playerMessage);
    if (prompt) npcPrompts.push(prompt);
  }

  // Step 4: check hook triggers
  const memory = {
    recentMessages: state.messages.slice(-10),
    revealedSecrets: state.revealedSecretIds,
  };
  const pendingHook = checkHookTriggers({
    playerMessage,
    turn: state.turn,
    memory,
  });
  state = { ...state, pendingHook };

  // Step 5: fire hook (if any) — append hook response to messages
  let hookResponse: HookResponse | null = null;
  if (pendingHook) {
    hookResponse = getHook(pendingHook)!.fire({
      playerMessage,
      turn: state.turn,
      memory,
    });
    state = addMessage(state, {
      speaker: 'npc',
      npcId: hookResponse.npcId,
      text: hookResponse.text,
      turn: state.turn,
    });
    state = {
      ...state,
      triggeredHookIds: [...state.triggeredHookIds, pendingHook],
      revealedSecretIds: [...state.revealedSecretIds, pendingHook],
    };
  }

  return { state, npcPrompts, hookResponse };
}

export { createInitialState, addMessage, ALL_NPC_IDS };
