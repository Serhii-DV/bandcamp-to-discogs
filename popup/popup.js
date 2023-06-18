import { tralbumDataToRelease } from '../src/modules/bandcamp.js';
import { objectToCsv, downloadCsv } from '../src/modules/csv.js';
import { releaseToCsvObject } from '../src/modules/release.js';
import { getCurrentTab } from '../src/modules/tab.js';

let release;
let saveCsvBtn = document.getElementById('save-csv');

saveCsvBtn.onclick = () => {
  let csvObject = releaseToCsvObject(release);
  downloadCsv(
    objectToCsv(csvObject),
    `discogs-${release.artist}-${release.title}`
  );
};

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

async function loadRelease() {
  getCurrentTab().then((tab) => {
    chrome.tabs.sendMessage(tab.id, {type:'getRelease'}, (response) => {
      release = tralbumDataToRelease(
        response.TralbumData,
        response.coverSrc
      );
      outputRelease(release);
    });
  });
}

loadRelease();
