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
