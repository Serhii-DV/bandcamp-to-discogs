import { safeFilename } from "./helpers.js";

export function arrayToCsv(rows) {
  return rows.map(e => e.join(",")).join("\n");
}

export function objectToCsv(obj) {
  const headers = Object.keys(obj);
  const values = Object.values(obj);
  const csvRows = [
    headers.join(','),
    values.join(',')
  ];
  return csvRows.join('\n');
}

export function downloadCsv(csv, csvFileName) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeFilename(csvFileName)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
