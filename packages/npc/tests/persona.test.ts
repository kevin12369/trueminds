import { describe, it, expect } from 'vitest';
import { loadPersonas, personaById, getDefaultPersonas } from '../src/persona';

describe('persona registry', () => {
  it('getDefaultPersonas returns 3 personas (innkeeper, traveler, drunkard)', () => {
    const ps = getDefaultPersonas();
    expect(ps).toHaveLength(3);
    expect(ps.map(p => p.id)).toEqual(['innkeeper', 'traveler', 'drunkard']);
  });

  it('each persona has name, age, background, speechPattern', () => {
    for (const p of getDefaultPersonas()) {
      expect(p.name).toBeTruthy();
      expect(p.age).toBeGreaterThan(0);
      expect(p.background.length).toBeGreaterThan(20);
      expect(p.speechPattern.length).toBeGreaterThan(5);
    }
  });

  it('loadPersonas returns the 3 default personas', () => {
    const ps = loadPersonas();
    expect(ps).toHaveLength(3);
  });

  it('personaById returns matching persona or undefined', () => {
    expect(personaById('innkeeper')?.id).toBe('innkeeper');
    expect(personaById('nope')).toBeUndefined();
  });

  it('innkeeper persona is sensitive (style = sensitive, initial = wary)', () => {
    const inn = personaById('innkeeper')!;
    expect(inn.style).toBe('sensitive');
  });
});
