export function extractDataFromMusicGridElement(element) {
  let artist = element.querySelector('.artist-override')?.innerText;

  if (!artist) {
    artist = document.querySelector('#band-name-location .title').innerText;
  }

  const titleParts = element.querySelector('.title').innerText.split("\n");
  const title = titleParts[0];
  const url = element.querySelector('a').getAttribute('href');

  return {
    artist: artist,
    title: title,
    url: (url[0] === '/' ? window.location.origin : '') + url,
  }
}
