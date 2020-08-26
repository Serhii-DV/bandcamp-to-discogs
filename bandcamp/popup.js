let changeColor = document.getElementById('changeColor');
let album = document.getElementById('release');
let releaseArtist = document.getElementById('release-artist');
let releaseTitle = document.getElementById('release-title');
let releaseDate = document.getElementById('release-year');
let releaseTracklist = document.getElementById('release-tracklist');

changeColor.onclick = function(element) {
	getRelease();
};

function outputRelease(release) {
	console.log(release);

	releaseArtist.innerHTML = release.artist;
	releaseTitle.innerHTML = release.title;
	releaseDate.innerHTML = release.date.getFullYear();

	let trackinfo = '';

	release.trackinfo.forEach(track => {
		trackinfo += `<li>${track.num} ${track.title} (${track.durationText})</li>`;
	});

	releaseTracklist.innerHTML = trackinfo;
}

function getRelease() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {type:'getRelease'}, function (response) {
			outputRelease(new Release(response));
		});
	});
}

getRelease();
