class TrackTime {
  #hours: number;
  #minutes: number;
  #seconds: number;

  constructor(hours: number, minutes: number, seconds: number) {
    this.#hours = hours;
    this.#minutes = minutes;
    this.#seconds = seconds;
  }

  get value(): string {
    return this.toString();
  }

  get date(): Date {
    return this.toDate();
  }

  toString(): string {
    const formatter = new Intl.DateTimeFormat('en', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    return formatter.format(this.toDate());
  }

  toDate(): Date {
    const date = new Date(0);
    date.setHours(this.#hours);
    date.setMinutes(this.#minutes);
    date.setSeconds(this.#seconds);

    return date;
  }

  static fromString(timeString: string): TrackTime {
    const timeFormat = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

    if (!timeFormat.test(timeString)) {
      throw new Error('Invalid time format. Please use HH:MM:SS.');
    }

    const [hours, minutes, seconds] = timeString.split(':');

    return new TrackTime(
      parseInt(hours, 10),
      parseInt(minutes, 10),
      parseInt(seconds, 10)
    );
  }

  static fromDuration(duration: string): TrackTime {
    const regexHours = /(\d+)H/;
    const regexMinutes = /(\d+)M/;
    const regexSeconds = /(\d+)S/;
    const hours = (regexHours.exec(duration) || [])[1] || '0';
    const minutes = (regexMinutes.exec(duration) || [])[1] || '0';
    const seconds = (regexSeconds.exec(duration) || [])[1] || '0';

    return new TrackTime(
      parseInt(hours, 10),
      parseInt(minutes, 10),
      parseInt(seconds, 10)
    );
  }
}

export default TrackTime;
