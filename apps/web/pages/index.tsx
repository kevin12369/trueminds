import { useState, useCallback } from 'react';
import { TavernScene } from '../components/TavernScene';
import { DialogueBubble } from '../components/DialogueBubble';
import { InputBar } from '../components/InputBar';
import { SettingsModal } from '../components/SettingsModal';
import { useTheme } from '../lib/theme';
import { useMemory } from '../lib/memory';
import { generateText } from '../lib/llm-direct';
import { runTurn, createInitialState, type TavernState } from '@trueminds/gm';

export default function Home() {
  const { theme, setTheme } = useTheme();
  const memory = useMemory();
  const [tavernState, setTavernState] = useState<TavernState>(createInitialState());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSend = useCallback(
    async (text: string) => {
      if (!text.trim() || busy) return;
      setBusy(true);
      try {
        const result = await runTurn(tavernState, text);
        // Append player message
        memory.addMessage({ speaker: 'player', text, turn: tavernState.turn });
        // Append hook response if any
        if (result.hookResponse) {
          memory.addMessage({
            speaker: 'npc',
            npcId: result.hookResponse.npcId,
            text: result.hookResponse.text,
            turn: tavernState.turn,
          });
        }
        // Call LLM for each NPC prompt and append NPC responses
        const activeNpcIds = result.state.activeNpcIds;
        for (let i = 0; i < result.npcPrompts.length; i++) {
          const prompt = result.npcPrompts[i]!;
          const llmBaseUrl =
            localStorage.getItem('trueminds:local:baseUrl') ?? 'http://localhost:11434';
          const llmModel = localStorage.getItem('trueminds:local:model') ?? 'llama3.1:8b';
          const llmProvider = (localStorage.getItem('trueminds:local:provider') ??
            'ollama') as 'ollama' | 'openai-compatible';
          const r = await generateText({
            system: prompt.system,
            user: prompt.user,
            model: llmProvider,
            localBaseUrl: llmBaseUrl,
            localModel: llmModel,
          });
          if (r.ok && r.text) {
            // Phase 1 heuristic: map each prompt to an active NPC by order
            const npcId = activeNpcIds[i % Math.max(activeNpcIds.length, 1)] ?? 'traveler';
            memory.addMessage({
              speaker: 'npc',
              npcId,
              text: r.text.trim(),
              turn: tavernState.turn,
            });
          }
        }
        setTavernState(result.state);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setBusy(false);
      }
    },
    [tavernState, busy, memory],
  );

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <header className="px-4 py-3 flex items-center border-b border-zinc-800">
        <h1 className="text-lg font-semibold">TrueMinds (戏中人)</h1>
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="ml-auto text-xl"
          aria-label="Open settings"
        >
          ⚙
        </button>
      </header>
      <TavernScene />
      <main className="flex-1 overflow-y-auto p-4 max-w-3xl mx-auto w-full flex flex-col gap-2">
        {memory.messages.map((m, i) => (
          <DialogueBubble key={i} message={m} />
        ))}
      </main>
      <InputBar onSend={onSend} disabled={busy} />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
      />
    </div>
  );
}
