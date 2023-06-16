// helper methods
export function durationToSeconds(duration) {
  let minutes = Math.floor(duration / 60);
  let seconds = duration % 60;

  return str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
}

function str_pad_left(string,pad,length) {
  return (new Array(length+1).join(pad)+string).slice(-length);
}

/* @see https://stackoverflow.com/a/8485137/3227570 */
export function safeFilename(value) {
  return value.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}
