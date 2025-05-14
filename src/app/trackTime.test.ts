import TrackTime from './trackTime';

describe('TrackTime', () => {
  describe('constructor', () => {
    it('should correctly initialize hours, minutes, and seconds', () => {
      const trackTime = new TrackTime(2, 30, 45);
      expect(trackTime.value).toBe('02:30:45');
    });
  });

  describe('getters', () => {
    it('should return the correct value as a formatted string', () => {
      const trackTime = new TrackTime(1, 15, 30);
      expect(trackTime.value).toBe('01:15:30');
    });
  });

  describe('toString', () => {
    it('should return a properly formatted time string', () => {
      const trackTime = new TrackTime(4, 5, 6);
      expect(trackTime.toString()).toBe('04:05:06');
    });
  });

  describe('fromString', () => {
    it('should create TrackTime from a valid time string', () => {
      const trackTime = TrackTime.fromString('06:30:15');
      expect(trackTime.value).toBe('06:30:15');
    });

    it('should throw an error for invalid time format', () => {
      expect(() => TrackTime.fromString('99:99:99')).toThrow(
        'Invalid time format. Please use HH:MM:SS.'
      );
      expect(() => TrackTime.fromString('invalid')).toThrow(
        'Invalid time format. Please use HH:MM:SS.'
      );
    });
  });

  describe('fromDuration', () => {
    it('should create TrackTime from an ISO 8601 duration string', () => {
      const trackTime1 = TrackTime.fromDuration('PT1H30M45S');
      expect(trackTime1.value).toBe('01:30:45');

      const trackTime2 = TrackTime.fromDuration('PT10M5S');
      expect(trackTime2.value).toBe('00:10:05');

      const trackTime3 = TrackTime.fromDuration('PT45S');
      expect(trackTime3.value).toBe('00:00:45');

      const trackTime4 = TrackTime.fromDuration('PT2H');
      expect(trackTime4.value).toBe('02:00:00');
    });

    it('should handle missing components in duration string', () => {
      const trackTime = TrackTime.fromDuration('PT5M');
      expect(trackTime.value).toBe('00:05:00');
    });

    it('should default to 0 for missing components', () => {
      const trackTime = TrackTime.fromDuration('PT');
      expect(trackTime.value).toBe('00:00:00');
    });
  });

  describe('toFormattedString', () => {
    it('should format time with hours ≥ 1', () => {
      const trackTime1 = new TrackTime(1, 5, 10);
      expect(trackTime1.toFormattedString()).toBe('1:05:10');

      const trackTime2 = new TrackTime(10, 0, 0);
      expect(trackTime2.toFormattedString()).toBe('10:00:00');
    });

    it('should format time with 0 hours and minutes ≥ 1', () => {
      const trackTime1 = new TrackTime(0, 1, 5);
      expect(trackTime1.toFormattedString()).toBe('1:05');

      const trackTime2 = new TrackTime(0, 10, 0);
      expect(trackTime2.toFormattedString()).toBe('10:00');
    });

    it('should format time with 0 hours, 0 minutes, and seconds', () => {
      const trackTime1 = new TrackTime(0, 0, 1);
      expect(trackTime1.toFormattedString()).toBe('0:01');

      const trackTime2 = new TrackTime(0, 0, 10);
      expect(trackTime2.toFormattedString()).toBe('0:10');
    });

    it('should handle complex cases', () => {
      const trackTime1 = new TrackTime(1, 23, 45);
      expect(trackTime1.toFormattedString()).toBe('1:23:45');

      const trackTime2 = new TrackTime(0, 12, 34);
      expect(trackTime2.toFormattedString()).toBe('12:34');
    });
  });

  describe('toFormattedString', () => {
    it('should format time with hours ≥ 1', () => {
      const trackTime1 = new TrackTime(1, 5, 10);
      expect(trackTime1.toFormattedString()).toBe('1:05:10');

      const trackTime2 = new TrackTime(10, 0, 0);
      expect(trackTime2.toFormattedString()).toBe('10:00:00');
    });

    it('should format time with 0 hours and minutes ≥ 1', () => {
      const trackTime1 = new TrackTime(0, 1, 5);
      expect(trackTime1.toFormattedString()).toBe('1:05');

      const trackTime2 = new TrackTime(0, 10, 0);
      expect(trackTime2.toFormattedString()).toBe('10:00');
    });

    it('should format time with 0 hours, 0 minutes, and seconds', () => {
      const trackTime1 = new TrackTime(0, 0, 1);
      expect(trackTime1.toFormattedString()).toBe('0:01');

      const trackTime2 = new TrackTime(0, 0, 10);
      expect(trackTime2.toFormattedString()).toBe('0:10');
    });

    it('should handle complex cases', () => {
      const trackTime1 = new TrackTime(1, 23, 45);
      expect(trackTime1.toFormattedString()).toBe('1:23:45');

      const trackTime2 = new TrackTime(0, 12, 34);
      expect(trackTime2.toFormattedString()).toBe('12:34');
    });
  });
});
