import {objectToCsv, downloadCsv} from '../src/modules/csv.js';
import {Release} from '../src/modules/classes.js';

let release;
let saveCsvBtn = document.getElementById('save-csv');

saveCsvBtn.onclick = () => {
  downloadCsv(
    releaseToCsv(release),
    `discogs-${release.artist}-${release.title}`
  );
};

function releaseToCsv(release) {
  let tracks = '';

  release.trackinfo.forEach(track => {
    tracks += track.title + ' ' + track.durationText + "\r";
  });

  // escape " symbols
  let notes = release.about ? release.about.replace('"', '""') : '';
  let date = [
    release.date.getFullYear(),
    release.date.getMonth().toString().padStart(2, 0),
    release.date.getDate().toString().padStart(2, 0)
  ].join('-');

  let csvObject = {
    artist: release.artist,
    title: `"${release.title}"`,
    label: `Not On Label (${release.artist} Self-released)`,
    catno: 'none',
    format: 'File',
    genre: 'Electronic',
    style: 'Industrial, Dark Ambient',
    tracks: `"${tracks}"`,
    notes: `"${notes}"`,
    date: date,
    images: release.coverSrc.big
  };

  return objectToCsv(csvObject);
}

function outputRelease(release) {
  let releaseCover = document.getElementById('release-cover');
  let releaseArtist = document.getElementById('release-artist');
  let releaseTitle = document.getElementById('release-title');
  let releaseDate = document.getElementById('release-year');
  let releaseTracklist = document.getElementById('release-tracklist');

  releaseCover.src = release.coverSrc.big;
  releaseArtist.innerHTML = release.artist;
  releaseTitle.innerHTML = release.title;
  releaseDate.innerHTML = release.date.getFullYear();

  let trackinfo = '';

  release.trackinfo.forEach(track => {
    trackinfo += `${track.num}. ${track.title} (${track.durationText})<br>`;
  });

  releaseTracklist.innerHTML = trackinfo;
}

function createRelease(TralbumData, coverSrc) {
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


async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

async function loadRelease() {
  let tabPromise = getCurrentTab();

  tabPromise.then((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        document.querySelector('#menubar').style.backgroundColor = "red";
      }
    });

    chrome.tabs.sendMessage(tab.id, {type:'getRelease'}, (response) => {
      release = createRelease(
        response.TralbumData,
        response.coverSrc
      );
      outputRelease(release);
    });
  });
}

loadRelease();
