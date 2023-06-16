import {safeFilename} from '../../src/modules/helpers.js';

export function csvContentFromArray(rows) {
  return "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
}

/* @see https://stackoverflow.com/a/14966131/3227570 */
export function downloadCsvContent(csvContent, csvFileName) {
  let encodedUri = encodeURI(csvContent);
  let link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', safeFilename(csvFileName) + '.csv');
  // document.body.appendChild(link);
  link.click();
}
