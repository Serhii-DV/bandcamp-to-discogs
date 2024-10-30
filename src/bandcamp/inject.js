/**
 * Injected script into Bandcamp page.
 * We can send any window data to our content.js script.
 */
window.postMessage({
  type: 'BANDCAMP_DATA',
  bandData: window.BandData
});
