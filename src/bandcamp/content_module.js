import { Release } from "../app/release.js";
import { createDatalistFromArray, createElementFromHTML, setDataAttribute } from "../modules/html.js";
import { explodeString, injectJSFile } from "../modules/utils.js";
import { extractDataFromMusicGridElement } from "./html.js";

export function main () {
  console.log('B2D: CONTENT AS MODULE');

  window.addEventListener('BC_Data', (e) => {
    if (isOnReleasesListPage()) {
      // Do nothing
      return;
    }

    // Getting data from script.js
    TralbumData = e.detail.TralbumData;
    BandData = e.detail.BandData;

    const currentTabUrl = window.location.href;
    const storage = chrome.storage.local;

    // storage.clear();

    storage.get([currentTabUrl], (result) => {
      if (!result[currentTabUrl] || !result[currentTabUrl]['release']) {
        const { tralbumData, bandData, schemaData, coverSrc } = extractReleaseData();
        const release = Release.fromBandcampData(
          tralbumData,
          bandData,
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

    // storage.get(null, (data) => {
    //   // Display the data in the console
    //   console.log("B2D: Local storage data");
    //   console.log(data);
    // });
  });

  injectJSFile(chrome.runtime.getURL('src/bandcamp/script.js'));

  if (isOnReleasesListPage()) {
    setupIsotope();
  }
}

function setupIsotope() {
  let grid = document.querySelector('#music-grid');
  let iso = new Isotope(grid, {
    itemSelector: '.music-grid-item',
    layoutMode: 'fitRows'
  });

  let gridItems = document.querySelectorAll('.music-grid-item');
  let releases = [];
  let filterData = [];

  gridItems.forEach((el) => {
    const releaseData = extractDataFromMusicGridElement(el);
    setDataAttribute(el, 'filter-artist', releaseData.artist + ' - ' + releaseData.title);
    releases.push(releaseData);
  });

  // add artists
  releases.forEach((release) => {
    const artists = explodeString(release.artist);
    filterData.push(...artists);
  });
  // add artists with release titles
  releases.forEach((release) => filterData.push(release.artist + ' - ' + release.title));

  const filterBlock = createElementFromHTML(`<div style="margin: 10px 0;">
  <label for="artist-filter">Artists:</label>
  </div>`);
  const artistFilter = createElementFromHTML('<input list="artist-filter-data" id="artist-filter" name="artist-filter" />');
  const filterSelectorData = [...new Set(filterData)];
  // const filterSelectorData = filterData;
  console.log(filterSelectorData);
  const filterSelector = createDatalistFromArray(filterSelectorData, 'artist-filter-data');

  filterBlock.append(artistFilter);
  filterBlock.append(filterSelector);
  document.querySelector('.leftMiddleColumns').prepend(filterBlock);

  artistFilter.addEventListener('input', () => {
    const selectedValue = artistFilter.value;
    const filter = selectedValue ? `[data-filter-artist*="${selectedValue}"]` : '*';
    iso.arrange({ filter: filter });

    console.log(`Selected value: ${selectedValue}`);
  });

  console.log('B2D: Isotope setuped correctly');
}
