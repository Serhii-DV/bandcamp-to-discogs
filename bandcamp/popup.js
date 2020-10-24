let changeColor = document.getElementById('changeColor');
let exportCsv = document.getElementById('exportCsv');

changeColor.onclick = function(element) {
	getRelease();
};

exportCsv.onclick = function () {
	chrome.storage.local.get(['release'], function(result) {
		let release = new Release(result.release);

		let rows =[];

		rows.push([
			'artist',
			'title',
			'label',
			'catno',
			'format',
			'genre',
			'style',
			'tracks',
			'notes',
			'date',
			'images',
		]);

		let tracks = '';

		release.trackinfo.forEach(track => {
			tracks += track.title + "\r";
		});

		// escape " symbols
		let notes = release.about.replace('"', '""');
		let date = [release.date.getFullYear(), d.getMonth().toString().padStart(2, 0), d.getDate().toString().padStart(2, 0)].join('-');

		rows.push([
			release.artist,
			release.title,
			`Not On Label (${release.artist} Self-released)`,
			'none',
			'File',
			'Electronic',
			'"Industrial, Dark Ambient"',
			`"${tracks}"`,
			`"${notes}"`,
			date,
			release.coverSrc.big,
		]);

		let csvContent = csvContentFromArray(rows);
		downloadCsvContent(csvContent, `discogs-${release.artist}-${release.title}`);
	});
};

function outputRelease(release) {
	console.log(release);

	let releaseCover = document.getElementById('release-cover');
	let releaseArtist = document.getElementById('release-artist');
	let releaseTitle = document.getElementById('release-title');
	let releaseDate = document.getElementById('release-year');
	let releaseTracklist = document.getElementById('release-tracklist');

	releaseCover.src = release.coverSrc.small;
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
