import { Release } from "../app/release.js";
import { createDatalistFromArray, createElementFromHTML, input, setDataAttribute } from "../modules/html.js";
import { explodeString, injectJSFile } from "../modules/utils.js";
import { isOnReleasesListPage } from "./bandcamp.js";
import { extractDataFromMusicGridElement } from "./html.js";

export function main () {
  console.log('B2D: CONTENT AS MODULE');

  setupSendMessageToPopup();

  window.addEventListener('BC_Data', (e) => {
    if (isOnReleasesListPage()) {
      // Do nothing
      return;
    }

    // Getting data from script.js
    const {TralbumData, BandData} = e.detail;
    const currentTabUrl = window.location.href;
    const storage = chrome.storage.local;

    // storage.clear();

    storage.get([currentTabUrl], (result) => {
      // Save release data to the storage if it doesn't exist
      if (!result[currentTabUrl] || !result[currentTabUrl]['release']) {
        const { schemaData, coverSrc } = extractReleaseData();
        const release = Release.fromBandcampData(
          TralbumData,
          BandData,
          schemaData,
          coverSrc
        );

        storage.set({ [currentTabUrl]: { release: release.toJSON() } }, () => {
          console.log("B2D: Release data was saved in local storage");
        });
      } else {
        console.log("B2D: Release data already exists");
      }
    });
  });

  injectJSFile(chrome.runtime.getURL('src/bandcamp/script.js'));

  if (isOnReleasesListPage()) {
    setupIsotope();
  }
}

function setupSendMessageToPopup() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let response;

    if (request.type === 'getBandcampData') {
      if (isOnReleasesListPage()) {
        sendResponse(generateListResponse());
      } else {
        const currentTabUrl = window.location.href;
        chrome.storage.local.get([currentTabUrl], (result) => {
          if (result[currentTabUrl] && result[currentTabUrl]['release']) {
            response = {
              type: 'release',
              data: result[currentTabUrl]['release']
            };
          }

          sendResponse(response);
        });
      }
    }

    return true;
  });
}

function generateListResponse() {
  const releases = [];
  const releaseElements = document.querySelectorAll('#music-grid .music-grid-item');
  const imgBandPhoto = document.querySelector('.band-photo');
  const artistFilter = document.querySelector('#b2dArtistFilter');

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

  return {
    type: 'list',
    data: releases,
    popup: {
      imageSrc: imgBandPhoto.src,
      search: artistFilter.value,
    }
  };
}

function setupIsotope() {
  let grid = document.querySelector('#music-grid');
  let iso = new Isotope(grid, {
    itemSelector: '.music-grid-item',
    layoutMode: 'fitRows'
  });

  const releases = getReleases();
  const artistFilterElement = createArtistFilterElement(releases);
  const filterBlock = createElementFromHTML(`<div style="margin: 10px 0;"></div>`);
  filterBlock.append(artistFilterElement);

  // Prepend to the releases bandcamp page
  document.querySelector('.leftMiddleColumns').prepend(filterBlock);

  setupArtistFilterElement(artistFilterElement, iso);

  console.log('B2D: Isotope setuped correctly');
}

function getReleases() {
  let gridItems = document.querySelectorAll('.music-grid-item');
  let releases = [];

  gridItems.forEach((el) => {
    const releaseData = extractDataFromMusicGridElement(el);
    setDataAttribute(el, 'filter-artist', releaseData.artist + ' - ' + releaseData.title);
    releases.push(releaseData);
  });

  return releases;
}

function getArtistListData(releases) {
  let filterData = [];

  // add artists
  releases.forEach((release) => {
    const artists = explodeString(release.artist);
    filterData.push(...artists);
  });
  filterData.sort();
  // add artists with release titles
  releases.forEach((release) => filterData.push(release.artist + ' - ' + release.title));

  return [...new Set(filterData)];
}

function createArtistFilterElement(releases) {
  let artistFilterElement = createElementFromHTML(
`<div class="b2d-artist-filter-widget">
  <label for="b2dArtistFilter">Artists:</label>
  <input list="artist-filter-data" id="b2dArtistFilter" name="artist-filter" />
</div>`);
  const artistFilterData = getArtistListData(releases);
  const artistFilterDatalist = createDatalistFromArray(artistFilterData, 'artist-filter-data');

  artistFilterElement.append(artistFilterDatalist);

  return artistFilterElement;
}

function setupArtistFilterElement(artistFilterElement, iso) {
  const artistFilter = artistFilterElement.querySelector('#b2dArtistFilter');
  artistFilter.addEventListener('input', () => {
    const selectedValue = artistFilter.value;
    const filter = selectedValue ? `[data-filter-artist*="${selectedValue}"]` : '*';
    iso.arrange({ filter: filter });

    // try to updata images
    window.scrollBy(0, 1);
    window.scrollBy(0, -1);
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'releases-list-search') {
      input(artistFilter, message.search);
    }
  });

}

function extractReleaseData() {
  return {
    schemaData: getSchemaData(),
    coverSrc: {
      small: document.querySelector('link[rel~="shortcut"]').href,
      big: document.querySelector('link[rel="image_src"]').href,
    },
  };
}

function getSchemaData() {
  const scriptElement = document.querySelector('script[type="application/ld+json"]');
  const scriptContent = scriptElement.textContent;
  return JSON.parse(scriptContent);
}
