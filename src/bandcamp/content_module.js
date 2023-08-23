import { Release } from "../app/release.js";
import { injectJSFile } from "../modules/utils.js";

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

  injectJSFile(chrome.runtime.getURL('src/bandcamp/script.js'), () => { console.log('B2D: Bandcamp script was injected'); });
}
