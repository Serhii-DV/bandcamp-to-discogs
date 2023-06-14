// helper methods
function durationToSeconds(duration) {
  let minutes = Math.floor(duration / 60);
  let seconds = duration % 60;

  return str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
}

function str_pad_left(string,pad,length) {
  return (new Array(length+1).join(pad)+string).slice(-length);
}

function csvContentFromArray(rows) {
  return "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
}

/* @see https://stackoverflow.com/a/14966131/3227570 */
function downloadCsvContent(csvContent, csvFileName) {
  let encodedUri = encodeURI(csvContent);
  let link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', safeFilename(csvFileName) + '.csv');
  // document.body.appendChild(link);
  link.click();
}

/* @see https://stackoverflow.com/a/8485137/3227570 */
function safeFilename(value) {
  return value.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}
