/**
 * Injected script into Bandcamp page.
 * We can send any window data to our content.js script.
 */
(function () {
  const pageData = JSON.parse(document.getElementById('pagedata').dataset.blob);

  window.postMessage({
    type: 'BANDCAMP_DATA',
    bandData: window.BandData,
    pageData
  });
})();
