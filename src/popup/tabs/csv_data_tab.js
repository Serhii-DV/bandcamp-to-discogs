import { Release } from "../../app/release.js";
import { generateSubmissionNotes, releaseToDiscogsCsv } from "../../discogs/discogs.js";
import { createKeyValueDetails, objectToDetailsElement, objectToHtmlElement } from "../../modules/utils.js";

export function setupCsvDataTab(release, btnCsvData) {

  btnCsvData.addEventListener('click', () => {
    const csvDataTabPane = document.getElementById('csvData');
    csvDataTabPane.innerHTML = '';

    if (release instanceof Release) {
      const discogsCsv = releaseToDiscogsCsv(release);

      appendObjectData(discogsCsv.toCsvObject(), 'Discogs CSV data', csvDataTabPane);
      appendTextareaDetails('B2D Release JSON Data', discogsCsv.notes, csvDataTabPane);
      appendTextareaDetails('Submission notes', generateSubmissionNotes(release), csvDataTabPane);

      csvDataTabPane.appendChild(objectToDetailsElement(release, 'Generated release data'));
      // csvDataTabPane.appendChild(objectToDetailsElement(tralbumData, 'Bandcamp TralbumData object'));
    }
  });

}

function appendObjectData(obj, headline, el) {
  const headlineEl = document.createElement('h2');
  headlineEl.classList.add('display-6');
  headlineEl.innerText = headline;
  el.appendChild(headlineEl);
  el.appendChild(objectToHtmlElement(obj));
}

function appendTextareaDetails(title, value, parentElement) {
  const textarea = document.createElement('textarea');
  textarea.classList.add('form-control');
  textarea.value = value;
  const detailsElement = createKeyValueDetails(title, textarea);
  detailsElement.open = true;

  parentElement.appendChild(detailsElement);
}
