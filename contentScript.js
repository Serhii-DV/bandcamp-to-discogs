'use strict';

let Release = {};

window.addEventListener("message", function(event) {
	// We only accept messages from ourselves
	if (event.source != window)
		return;

	Release = event.data;
	console.log("Content script received: ", Release);
	// if (event.data.type && (event.data.type == "FROM_PAGE")) {
		// chrome.runtime.sendMessage({release: event.data});
		// console.log("Sended message: ", event.data);
	// }
}, false);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.type == 'getRelease') {
		sendResponse(Release);
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
	}

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
