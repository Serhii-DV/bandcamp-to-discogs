// helper methods
export function durationToSeconds(duration) {
  let minutes = Math.floor(duration / 60);
  let seconds = duration % 60;

  return str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
}

function str_pad_left(string,pad,length) {
  return (new Array(length+1).join(pad)+string).slice(-length);
}

/** @see https://stackoverflow.com/a/8485137/3227570 */
export function safeFilename(value) {
  return transliterate(value).replace(/[^a-zA-Z0-9]/gi, '_').toLowerCase();
}

let a = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"A","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};

/** @see https://stackoverflow.com/a/11404121 */
function transliterate(word) {
  return word.split('').map(function (char) {
    return a[char] || char;
  }).join("");
}

/** @see https://flexiple.com/javascript/javascript-capitalize-first-letter/ */
export function eachWordFirstLetterToUpperCase(str) {
  const arr = str.split(" ");

  for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }

  return arr.join(" ");
}
