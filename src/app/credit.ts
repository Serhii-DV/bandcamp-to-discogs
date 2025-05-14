import { convertBreaksToNewlines } from '../utils/string';
import creditsMapping from '../data/credits_mapping.json';

export interface Credit {
  artist: string[];
  roles: string[];
}

function titleCase(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function cleanRoles(raw: string): string[] {
  // Normalize '&' and 'by' in roles and split them correctly
  return raw
    .replace(/&/g, ',') // Normalize '&' to ','
    .replace(/ by$/i, '') // Remove trailing 'by'
    .split(/,| and |&/i) // Split on commas, 'and', or '&'
    .map((role) => titleCase(role.trim())) // Capitalize roles
    .filter(Boolean); // Remove empty roles
}

function cleanArtist(raw: string): string {
  // Clean unnecessary parts of the artist string but preserve important formatting
  const match = raw.match(
    /^(.*)\s(by|for|in|on|at|created by)\s[^.,;]+[.,;]?\s*$/i
  );
  if (match) {
    return match[1].trim();
  }
  const match2 = raw.match(/^(.*)\s(by|for|in|on|at|created by)\s[^.,;]+$/i);
  if (match2) {
    return match2[1].trim();
  }
  return raw.trim();
}

export function extractCredits(text: string): Credit[] {
  const lines = convertBreaksToNewlines(text)
    .split(/\n|\. ?/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith('©')); // Ignore copyright lines
  const credits: Credit[] = [];

  for (const line of lines) {
    let match: RegExpMatchArray | null;

    // Match "role: artist" format
    if ((match = line.match(/^(.+?)\s*:\s*(.+)$/))) {
      const roles = cleanRoles(match[1]);
      const artist = cleanArtist(match[2]);
      processArtistString(artist, roles, credits);
      continue;
    }

    // Match "role - artist" format
    if ((match = line.match(/^(.+?)\s*[-–—]\s*(.+)$/))) {
      const roles = cleanRoles(match[1]);
      const artist = cleanArtist(match[2]);
      processArtistString(artist, roles, credits);
      continue;
    }

    // Match "roles by artist" format
    if ((match = line.match(/^(.+?)\s*by\s*(.+)$/i))) {
      const roles = cleanRoles(match[1]);
      const artist = cleanArtist(match[2]);
      processArtistString(artist, roles, credits);
      continue;
    }

    // Match "role & role" format for multiple roles in the same line
    if ((match = line.match(/^(.+?)\s*(&|and)\s*(.+)$/i))) {
      const roles = cleanRoles(match[1]);
      const additionalRoles = cleanRoles(match[3]);
      const artist = cleanArtist(match[2]);
      processArtistString(artist, [...roles, ...additionalRoles], credits);
      continue;
    }
  }

  return mapCreditRoles(credits);
}

/**
 * Maps role names to their standardized versions using the credits_mapping.json file
 * @param credits Array of credits to map the roles for
 * @returns A new array of credits with mapped role names
 */
function mapCreditRoles(credits: Credit[]): Credit[] {
  return credits.map((credit) => ({
    artist: [...credit.artist],
    roles: credit.roles.map(
      (role) => creditsMapping[role as keyof typeof creditsMapping] || role
    )
  }));
}

function processArtistString(
  artistString: string,
  roles: string[],
  results: Credit[]
): void {
  // Split by "and" or "&" to handle multiple artists
  if (artistString.includes(' and ') || artistString.includes('&')) {
    const splitArtists = artistString.split(/ and |&/i).map((a) => a.trim());

    // For each artist name, create a separate credit entry
    splitArtists.forEach((singleArtist) => {
      // Handle parenthetical notation for each individual artist
      const parsedArtist = parseSingleArtist(singleArtist);
      results.push({ artist: parsedArtist, roles });
    });
  } else {
    // Handle parenthetical notation
    results.push({ artist: parseSingleArtist(artistString), roles });
  }
}

function parseSingleArtist(artistString: string): string[] {
  const result: string[] = [];
  const trimmedArtist = artistString.trim();

  // Check if artist name contains parentheses
  const parenthesesMatch = trimmedArtist.match(/^(.*?)\s*\((.*?)\)$/);

  if (parenthesesMatch) {
    // Add the name outside parentheses
    result.push(parenthesesMatch[1].trim());

    // Add the name inside parentheses
    result.push(parenthesesMatch[2].trim());
  } else {
    // Just add the name as is
    result.push(trimmedArtist);
  }

  return result;
}
