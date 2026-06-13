import Link from 'next/link';
import Head from 'next/head';

const NAME = '戏中人 · TrueMinds';
const TAGLINE = '3 NPC + 银钥匙钩子的多 Agent 文字冒险';
const DESCRIPTION =
  'TrueMinds is a multi-agent text adventure where 3 NPC agents (老板娘 / 神秘旅人 / 酒鬼) each have their own persona, memory, and goals. A "silver key" plot hook triggers the drunkard after turn 5 to reveal a hidden relationship the player never knew about — emergent narrative, not a scripted branch.';
const GITHUB_URL = 'https://github.com/kevin12369/trueminds';
const DEMO_URL = 'https://kevin12369.github.io/trueminds/';

export default function Portfolio() {
  return (
    <>
      <Head>
        <title>{NAME} — Portfolio</title>
        <meta name="description" content={DESCRIPTION} />
      </Head>
      <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 max-w-3xl mx-auto flex flex-col gap-6">
        <header>
          <h1 className="text-3xl font-semibold">{NAME}</h1>
          <p className="text-zinc-400 mt-1">{TAGLINE}</p>
        </header>
        <section className="rounded border border-zinc-800 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/trueminds/docs/img/main.png" alt={`${NAME} demo screenshot`} className="w-full" />
        </section>
        <section className="prose prose-invert max-w-none">
          <p>{DESCRIPTION}</p>
          <h2>What you can do here</h2>
          <ul>
            <li>Open the tavern scene and meet 3 NPC agents — each with its own persona + memory</li>
            <li>Type a line of dialogue — NPCs respond in their own style (sensitive / direct / cold)</li>
            <li>Watch the &quot;silver key&quot; plot hook auto-fire on turn 5+ and reveal a hidden NPC relationship</li>
            <li>Switch between local LLM backends (Ollama / LM Studio / vLLM / llama.cpp) in Settings</li>
          </ul>
          <h2>How to run it for real</h2>
          <p>The live demo above is a portfolio preview. To run the real deal:</p>
          <ul>
            <li>
              See <Link href="/trueminds/docs/RUN-LOCALLY.md">/docs/RUN-LOCALLY.md</Link> for the
              1-page clone-and-run guide.
            </li>
            <li>
              Or <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">browse the source on GitHub</a>.
            </li>
          </ul>
          <h2>Other projects in this portfolio</h2>
          <ul>
            <li>
              <a href="https://kevin12369.github.io/sry-portfolio/" target="_blank" rel="noopener noreferrer">
                嘴笨助手 Sry
              </a>{' '}
              — 5 风格道歉信生成器
            </li>
            <li>
              <a href="https://kevin12369.github.io/whimsy-portfolio/" target="_blank" rel="noopener noreferrer">
                一念成游 Whimsy
              </a>{' '}
              — AI 2D 小游戏生成器
            </li>
            <li>
              <a href="https://kevin12369.github.io/hummingbird-portfolio/" target="_blank" rel="noopener noreferrer">
                哼哼编曲 Hummingbird
              </a>{' '}
              — 哼唱→MIDI 编曲
            </li>
          </ul>
        </section>
        <footer>
          <Link href="/trueminds/" className="text-sm text-zinc-400 hover:text-zinc-200">
            ← Back to demo
          </Link>
        </footer>
      </main>
    </>
  );
}