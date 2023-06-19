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

function countLines(el) {
  let divHeight = el.offsetHeight
  let lineHeight = parseInt(getComputedStyle(el).lineHeight);
  return Math.round(divHeight / lineHeight);
}

function outputRelease(release) {
  let releaseEl = document.getElementById('release');
  let releaseCover = document.getElementById('release-cover');
  let releaseArtist = document.getElementById('release-artist');
  let releaseTitle = document.getElementById('release-title');
  let releaseDate = document.getElementById('release-year');
  let releaseTracklist = document.getElementById('release-tracklist');

  releaseCover.src = release.coverSrc.big;
  releaseArtist.innerHTML = release.artist;
  releaseTitle.innerHTML = release.title;
  releaseDate.innerHTML = release.date.getFullYear();

  let countArtistLines = countLines(releaseArtist);
  let countTitleLines = countLines(releaseTitle);

  switch (countArtistLines) {
    case 3:
    case 4:
    case 5:
      releaseArtist.classList.add('display-6');
      break;
  }

  releaseEl.classList.add('lines-a' + countArtistLines + '-t' + countTitleLines);

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
