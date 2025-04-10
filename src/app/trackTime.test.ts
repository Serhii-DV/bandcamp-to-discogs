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
});
