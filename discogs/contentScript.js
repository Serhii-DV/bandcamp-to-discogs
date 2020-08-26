'use strict';

let Release;

chrome.storage.local.get(['release'], function(result) {
	console.log(result.release);
});