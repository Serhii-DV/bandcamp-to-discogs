import { safeFilename } from "./utils.js";

export function arrayToCsv(rows: Array<Array<string>>): string {
  return rows.map(e => e.join(",")).join("\n");
}

export function objectsToCsv(objects: Array<Record<string, any>>): string {
  if (!objects || objects.length === 0) {
    return ''; // Return an empty string if the array is empty or not provided
  }

  const headers = Object.keys(objects[0]);
  const csvRows = [headers.join(',')];

  for (const obj of objects) {
    const values = headers.map((header) => obj[header]);
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

export function downloadCsv(csv: string, csvFileName: string): void {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeFilename(csvFileName)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
