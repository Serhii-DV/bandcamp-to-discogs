import { openTabs } from "../../modules/chrome.js";
import { fillReleasesForm } from "../helpers.js";

export function setupReleasesTab(releases, releaseForm, btnSubmitReleases) {
  fillReleasesForm(releases, releaseForm, true)

  btnSubmitReleases.addEventListener("click", async () => {
    const checkedCheckboxes = Array.from(releaseForm.querySelectorAll('input[type="checkbox"]:checked'));
    const checkedUrls = checkedCheckboxes.map((checkbox) => checkbox.value);

    await openTabs(checkedUrls, (tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: waitForBandcampData
      }).then(() => {
        // Let's wait 1 second
        setTimeout(() => console.log('After executing the script'), 1000);
      });
    });
  });
}

function waitForBandcampData() {
  setTimeout(() => window.close(), 1000);
}
