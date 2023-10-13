export function getAlbumRelease(musicAlbum, releaseFormat) {
  let release;

  musicAlbum.albumRelease.forEach(element => {
    if (element.musicReleaseFormat && element.musicReleaseFormat === releaseFormat) {
      release = element;
      return false;
    }
  });

  return release;
}
