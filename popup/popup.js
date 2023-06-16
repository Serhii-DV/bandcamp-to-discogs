import {csvContentFromArray, downloadCsvContent} from '../src/modules/csv.js';
import {Release} from '../src/modules/classes.js';

document.getElementById('get-release').onclick = function(element) {
  createRelease();
};
let exportCsv = document.getElementById('export-csv');

exportCsv.onclick = function () {
  chrome.storage.local.get(['release'], function(result) {
    let release = new Release(result.release);

    let rows =[];

    rows.push([
      'artist',
      'title',
      'label',
      'catno',
      'format',
      'genre',
      'style',
      'tracks',
      'notes',
      'date',
      'images',
    ]);

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

    rows.push([
      release.artist,
      `"${release.title}"`,
      `Not On Label (${release.artist} Self-released)`,
      'none',
      'File',
      'Electronic',
      '"Industrial, Dark Ambient"',
      `"${tracks}"`,
      `"${notes}"`,
      date,
      release.coverSrc.big,
    ]);

    let csvContent = csvContentFromArray(rows);
    downloadCsvContent(csvContent, `discogs-${release.artist}-${release.title}`);
  });
};

function outputRelease(release) {
  let releaseCover = document.getElementById('release-cover');
  let releaseArtist = document.getElementById('release-artist');
  let releaseTitle = document.getElementById('release-title');
  let releaseDate = document.getElementById('release-year');
  let releaseTracklist = document.getElementById('release-tracklist');

  releaseCover.src = release.coverSrc.small;
  releaseArtist.innerHTML = release.artist;
  releaseTitle.innerHTML = release.title;
  releaseDate.innerHTML = release.date.getFullYear();

  let trackinfo = '';

  release.trackinfo.forEach(track => {
    trackinfo += `<li>${track.num} ${track.title} (${track.durationText})</li>`;
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

async function getRelease() {
  let tabPromise = getCurrentTab();

  tabPromise.then((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        document.querySelector('#menubar').style.backgroundColor = "red";
      }
    });

    chrome.tabs.sendMessage(tab.id, {type:'getRelease'}, (response) => {
      outputRelease(createRelease(
        response.TralbumData,
        response.coverSrc
      ));
    });
  });
}

getRelease();
