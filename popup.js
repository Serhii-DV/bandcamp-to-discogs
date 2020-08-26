let changeColor = document.getElementById('changeColor');
let album = document.getElementById('release');
let releaseArtist = document.getElementById('release-artist');
let releaseTitle = document.getElementById('release-title');
let releaseDate = document.getElementById('release-year');
let releaseTracklist = document.getElementById('release-tracklist');

// Classes

class Release {
	constructor(release) {
		this.artist = release.artist;
		this.title = release.title;
		this.date = new Date(release.release_date);
		this.trackinfo = [];

		release.trackinfo.forEach(track => {
			this.trackinfo.push(new Track(track));
		});

		this.url = release.url;
		this.about = release.about;
		this.credits = release.credits;
		this.type = release.type;
		this.coverSrc = release.coverSrc;
	}
}

class Track {
	constructor(data) {
		this.num = data.num;
		this.title = data.title;
		this.duration = data.duration;
		this.durationText = durationToSeconds(Math.trunc(this.duration));
	}
}

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

// helper methods
function durationToSeconds(duration) {
	let minutes = Math.floor(duration / 60);
	let seconds = duration % 60;

	return str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
}

function str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
}