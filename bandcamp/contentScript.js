'use strict';

let release = {};

window.addEventListener("message", function(event) {
	// We only accept messages from ourselves
	if (event.source != window)
		return;

	release = event.data;
	console.log("Content script received: ", release);
	chrome.storage.local.set({release: release});
}, false);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.type == 'getRelease') {
		sendResponse(release);
	}
});

function main () {
	let release = {
		artist: TralbumData.current.artist,
		title: TralbumData.current.title,
		release_date: TralbumData.current.release_date,
		trackinfo: [],
		url: TralbumData.url,
		about: TralbumData.current.about,
		credits: TralbumData.current.credits,
		type: TralbumData.current.type,
		coverSrc: '',
	}

	// Get cover
	let linkImageSrc = document.querySelectorAll('link[rel="image_src"]');
	release.coverSrc = linkImageSrc[0].getAttribute('href');

	TralbumData.trackinfo.forEach(track => {
		release.trackinfo.push({
			num: track.track_num,
			title: track.title,
			duration: track.duration,
		});
	});

	window.postMessage(release);
}

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ main +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
