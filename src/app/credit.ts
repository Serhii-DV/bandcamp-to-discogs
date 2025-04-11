export interface Credit {
  artist: string;
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
  const lines = text
    .split(/\n|\. ?/)
    .map((l) => l.trim())
    .filter(Boolean);
  const results: Credit[] = [];

  for (const line of lines) {
    let match: RegExpMatchArray | null;

    // Match "role - artist" format
    if ((match = line.match(/^(.+?)\s*[-–—]\s*(.+)$/))) {
      const roles = cleanRoles(match[1]);
      const artist = cleanArtist(match[2]);
      results.push({ artist, roles });
      continue;
    }

    // Match "roles by artist" format
    if ((match = line.match(/^(.+?)\s*by\s*(.+)$/i))) {
      const roles = cleanRoles(match[1]);
      const artist = cleanArtist(match[2]);
      results.push({ artist, roles });
      continue;
    }

    // Match "role & role" format for multiple roles in the same line
    if ((match = line.match(/^(.+?)\s*(&|and)\s*(.+)$/i))) {
      const roles = cleanRoles(match[1]);
      const additionalRoles = cleanRoles(match[3]);
      const artist = cleanArtist(match[2]);
      results.push({ artist, roles: [...roles, ...additionalRoles] });
      continue;
    }
  }

  return results;
}
