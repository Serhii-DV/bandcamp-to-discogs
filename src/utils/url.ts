export function getUrlHostname(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch (error) {
    console.error('Invalid URL', url);
    return '';
  }
}

export function getUrlSubdomain(url: string): string | null {
  const hostname = getUrlHostname(url);

  if (hostname === null) {
    return null;
  }

  const parts = hostname.split('.');
  // Assuming subdomain is everything before the second-to-last part of the domain
  if (parts.length > 2) {
    return parts.slice(0, -2).join('.');
  }

  return '';
}
