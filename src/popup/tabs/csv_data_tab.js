import { Release } from '../../app/release.js';
import { releaseToDiscogsCsv } from '../../discogs/modules/discogs.js';
import { objectToHtmlElement } from '../helpers.js';

export function setupCsvDataTab(release, btnCsvData) {
  btnCsvData.addEventListener('click', () => {
    const csvDataTabPane = document.getElementById('csvData');
    csvDataTabPane.innerHTML = '';

    if (release instanceof Release) {
      const discogsCsv = releaseToDiscogsCsv(release);
      appendObjectDataAsTable(
        'Discogs CSV data',
        discogsCsv.toCsvObject(),
        csvDataTabPane
      );
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
