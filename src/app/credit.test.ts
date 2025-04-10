import { extractCredits } from './credit';
import { describe, it, expect } from '@jest/globals';

describe('extractCredits', () => {
  it('parses example 1 correctly', () => {
    const input = `Composed, programmed, mixed & mastered by Alberto "XIII" HERNÁNDEZ SERRADILLA for Crvor Martyrivm in 2018.`;
    expect(extractCredits(input)).toEqual([
      {
        artist: `Alberto "XIII" HERNÁNDEZ SERRADILLA for Crvor Martyrivm`,
        roles: ['Composed', 'Programmed', 'Mixed', 'Mastered']
      }
    ]);
  });

  it('parses example 2 correctly', () => {
    const input = `Written, Produced, Performed - Robert Kozletsky
Artwork - Erik "Keosz" Osvald
Mastering - Simon Heath`;
    expect(extractCredits(input)).toEqual([
      {
        artist: 'Robert Kozletsky',
        roles: ['Written', 'Produced', 'Performed']
      },
      {
        artist: 'Erik "Keosz" Osvald',
        roles: ['Artwork']
      },
      {
        artist: 'Simon Heath',
        roles: ['Mastering']
      }
    ]);
  });

  it('parses example 3 correctly', () => {
    const input = `Ansiktsløs sigil by Simon Heath.
Visual stimulus & design created by Alejandro Tegin (Heresie Studio)
Mastering by Frederic Arbour`;
    expect(extractCredits(input)).toEqual([
      {
        artist: 'Simon Heath',
        roles: ['Ansiktsløs sigil']
      },
      {
        artist: 'Alejandro Tegin (Heresie Studio)',
        roles: ['Visual stimulus', 'Design created']
      },
      {
        artist: 'Frederic Arbour',
        roles: ['Mastering']
      }
    ]);
  });
});
