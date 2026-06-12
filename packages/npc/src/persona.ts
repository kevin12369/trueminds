import type { Persona } from './types';

const personas: Persona[] = [
  {
    id: 'innkeeper',
    name: '老板娘',
    age: 45,
    background: '经营小酒馆 20 年,见过各种客人,记仇也记恩。',
    speechPattern: '短句,带点嘲讽,反应快,易怒但也不失风情。',
    style: 'sensitive',
    initialState: 'wary',
  },
  {
    id: 'traveler',
    name: '神秘旅人',
    age: 30,
    background: '自称外地行商,似乎在躲避什么追兵。身上藏着一把银钥匙,眼神警觉。',
    speechPattern: '直接,主动给信息,但藏着秘密。',
    style: 'direct',
    initialState: 'friendly',
  },
  {
    id: 'drunkard',
    name: '酒鬼',
    age: 60,
    background: '每天坐在角落喝酒,几乎不跟人说话。据说有故事。',
    speechPattern: '冷淡,话少,5 轮后突然开口,声音沙哑。',
    style: 'cold',
    initialState: 'neutral',
  },
];

export function getDefaultPersonas(): Persona[] {
  return personas;
}

export function loadPersonas(): Persona[] {
  return personas;
}

export function personaById(id: string): Persona | undefined {
  return personas.find((p) => p.id === id);
}
