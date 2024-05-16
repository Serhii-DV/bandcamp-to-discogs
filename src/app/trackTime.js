class TrackTime {
  /**
   * @type {Number}
   */
  #hours;

  /**
   * @type {Number}
   */
  #minutes;

  /**
   * @type {Number}
   */
  #seconds;

  /**
   * Constructs a Time object with hours, minutes, and seconds.
   * @param {number} hours - The hours component of the time.
   * @param {number} minutes - The minutes component of the time.
   * @param {number} seconds - The seconds component of the time.
   */
  constructor(hours, minutes, seconds) {
      this.#hours = hours;
      this.#minutes = minutes;
      this.#seconds = seconds;
  }

  get value() {
    return this.toString();
  }

  /**
   * Returns a string representation of the duration in the format "HH:MM:SS".
   * @returns {string} String representation of the duration.
   */
  toString() {
    const formatter = new Intl.DateTimeFormat('en', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return formatter.format(this.toDate());
  }

  toDate() {
    const date = new Date(0);
    date.setHours(this.#hours);
    date.setMinutes(this.#minutes);
    date.setSeconds(this.#seconds);

    return date;
  }

  /**
   * Parses a time string in the format HH:MM:SS and returns an object with hours, minutes, and seconds.
   * Throws an error if the input string is not in the valid time format.
   *
   * @param {string} timeString - The time string to parse, expected in the format HH:MM:SS.
   * @returns {TrackTime} A Time object containing the parsed hours, minutes, and seconds as numbers.
   * @throws {Error} Throws an error if the input string is not in the valid time format HH:MM:SS.
   */
  static fromString(timeString) {
    // Regular expression to match HH:MM:SS format
    const timeFormat = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

    if (!timeFormat.test(timeString)) {
        throw new Error("Invalid time format. Please use HH:MM:SS.");
    }

    const [hours, minutes, seconds] = timeString.split(':');

    return new TrackTime(
      parseInt(hours, 10),
      parseInt(minutes, 10),
      parseInt(seconds, 10)
    );
  }

  /**
   * Creates a Duration instance from a duration string.
   * The duration string should be in the format "XHYMZS",
   * where X is hours, Y is minutes, and Z is seconds.
   * See: https://en.wikipedia.org/wiki/ISO_8601
   * @param {string} duration
   * @returns {TrackTime}
   */
  static fromDuration(duration) {
    const regexHours = /(\d+)H/;
    const regexMinutes = /(\d+)M/;
    const regexSeconds = /(\d+)S/;
    const hours = (regexHours.exec(duration) || [])[1] || 0;
    const minutes = (regexMinutes.exec(duration) || [])[1] || 0;
    const seconds = (regexSeconds.exec(duration) || [])[1] || 0;

    return new TrackTime(
      parseInt(hours, 10),
      parseInt(minutes, 10),
      parseInt(seconds, 10)
    );
  }
}

export default TrackTime;
