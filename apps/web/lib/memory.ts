import { useState, useEffect, useCallback } from 'react';

export type Speaker = 'player' | 'npc' | 'gm';
export interface Message {
  speaker: Speaker;
  npcId?: string;
  text: string;
  turn: number;
}

const LRU_SIZE = 10;
const STORAGE_KEY = 'trueminds:memory:v1';

interface StoredMemory {
  messages: Message[];
}

function loadFromStorage(): Message[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredMemory;
    return parsed.messages ?? [];
  } catch {
    return [];
  }
}

function saveToStorage(messages: Message[]): void {
  if (typeof localStorage === 'undefined') return;
  const data: StoredMemory = { messages };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useMemory() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages(loadFromStorage());
  }, []);

  const addMessage = useCallback((m: Message) => {
    setMessages((prev) => {
      const next = [...prev, m].slice(-LRU_SIZE);
      saveToStorage(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setMessages([]);
    saveToStorage([]);
  }, []);

  return { messages, addMessage, clear };
}
