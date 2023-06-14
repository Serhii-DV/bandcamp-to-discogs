'use strict';

let release;

chrome.storage.local.get(['release'], function(result) {
  release = new Release(result.release);
});

console.log(release);
