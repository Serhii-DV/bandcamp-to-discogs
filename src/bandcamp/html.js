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

export function getReleasesData() {
  const releases = [];
  const releaseElements = document.querySelectorAll('#music-grid .music-grid-item');

  releaseElements.forEach(element => {
    let artist = element.querySelector('.artist-override')?.innerText;

    if (!artist) {
      artist = document.querySelector('#band-name-location .title').innerText;
    }

    const titleParts = element.querySelector('.title').innerText.split("\n");
    const title = titleParts[0];
    const url = element.querySelector('a').getAttribute('href');
    releases.push({
      url: (url[0] === '/' ? window.location.origin : '') + url,
      artist: artist,
      title: title
    });
  });

  return releases;
}

export function getBandPhotoSrc() {
  const imgBandPhoto = document.querySelector('.band-photo');
  return imgBandPhoto.src;
}
