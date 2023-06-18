import { Release } from "./release.js";

export function tralbumDataToRelease(TralbumData, coverSrc) {
  let release = {
    artist: TralbumData.artist,
    title: TralbumData.current.title,
    release_date: TralbumData.album_release_date,
    trackinfo: [],
    url: TralbumData.url,
    about: TralbumData.current.about,
    credits: TralbumData.current.credits,
    type: TralbumData.current.type,
    coverSrc: coverSrc
  }

  TralbumData.trackinfo.forEach(track => {
    release.trackinfo.push({
      num: track.track_num,
      title: track.title,
      duration: track.duration,
    });
  });

  return new Release(release);
}
