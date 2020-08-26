// helper methods
function durationToSeconds(duration) {
	let minutes = Math.floor(duration / 60);
	let seconds = duration % 60;

	return str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
}

function str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
}
