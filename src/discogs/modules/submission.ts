export function convertArtistName(artist: string): string {
  const variousArtists = ['VVAA', 'Various Artist', 'Various Artists'];
  return variousArtists.includes(artist) ? 'Various' : artist;
}
