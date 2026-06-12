import type { Hook, HookContext, HookResponse } from './types';

export const hooks: Hook[] = [
  {
    id: 'silver-key',
    triggerCondition: (ctx) => {
      if (ctx.turn < 5) return false;
      const msg = ctx.playerMessage.toLowerCase();
      return /(\b(?:secret|key)\b|银|钥|秘)/i.test(msg);
    },
    fire: (ctx) => ({
      npcId: 'drunkard',
      text: '(酒鬼抬起头,声音沙哑)……你知道这把钥匙的事?',
      isHook: true,
    }),
  },
];

export function getHook(id: string): Hook | undefined {
  return hooks.find((h) => h.id === id);
}

export function fireHook(id: string, ctx: HookContext): HookResponse | undefined {
  const h = getHook(id);
  if (!h) return undefined;
  if (!h.triggerCondition(ctx)) return undefined;
  return h.fire(ctx);
}
