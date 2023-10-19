import { Release } from "../../app/release.js";
import { releaseToDiscogsCsv } from "../../discogs/modules/discogs.js";
import { createKeyValueDetails, objectToDetailsElement, objectToHtmlElement } from "../helpers.js";

export function setupCsvDataTab(release, keywordsMapping, btnCsvData) {

  btnCsvData.addEventListener('click', () => {
    const csvDataTabPane = document.getElementById('csvData');
    csvDataTabPane.innerHTML = '';

    if (release instanceof Release) {
      const discogsCsv = releaseToDiscogsCsv(release);

      appendObjectDataAsTable('Discogs CSV data', discogsCsv.toCsvObject(), csvDataTabPane);
      appendTextareaDetails('B2D Release JSON Data', discogsCsv.notes, csvDataTabPane);
      appendObjectDataAsTree('Generated release data', release, csvDataTabPane);
      appendObjectDataAsTree('Bandcamp keywords to Discogs styles mapping', keywordsMapping, csvDataTabPane);
    }
  });

}

function appendObjectDataAsTable(headline, obj, el) {
  const headlineEl = document.createElement('h2');
  headlineEl.classList.add('display-6');
  headlineEl.innerText = headline;
  el.appendChild(headlineEl);
  el.appendChild(objectToHtmlElement(obj));
}

function appendObjectDataAsTree(headline, obj, el) {
  el.appendChild(objectToDetailsElement(obj, headline))
}

function appendTextareaDetails(title, value, parentElement) {
  const textarea = document.createElement('textarea');
  textarea.classList.add('form-control');
  textarea.value = value;
  const detailsElement = createKeyValueDetails(title, textarea);
  // detailsElement.open = true;

  parentElement.appendChild(detailsElement);
}
