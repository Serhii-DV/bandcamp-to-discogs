import {safeFilename} from ".//helpers.js";

export function arrayToCsv(rows) {
  return rows.map(e => e.join(",")).join("\n");
}

export function objectToCsv(obj) {
    let csvRows = [];

    let headers = Object.keys(obj);
    csvRows.push(headers.join(','));

    let values = Object.values(obj).join(',');
    csvRows.push(values)

    return csvRows.join('\n')
}

export function downloadCsv(csv, csvFileName) {
  let blob = new Blob([csv], {type: 'text/csv'});
  let url = window.URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', safeFilename(csvFileName) + '.csv');
  a.click();
}
