import { gammaPeak, NullPeak, Peak } from '../../src/stats/peak';
import Transcription from '../../src/transcription';
import TranscriptionGenerator from '../transcription-generator';
import { imageMD } from '../transcription-templates';

describe('Transcription Peak', () => {
  // Transcription peak
  describe('gammaPeak', () => {
    test('should return 0 for empty array', () => {
      const transcriptions: Transcription[] = [];
      const duration = 24 * 60 * 60; // 24h
      const actual = gammaPeak(transcriptions, duration);
      const expected: NullPeak = {
        peak: 0,
      };

      expect(actual).toEqual(expected);
    });
    test('should return 1 for one element array', () => {
      const date = new Date('2020-11-02').valueOf() / 1000;
      const transcription = new Transcription('a', imageMD, '', date, 12, 'r/Old_Recipes');
      const transcriptions: Transcription[] = [transcription];
      const duration = 24 * 60 * 60; // 24h

      const actual = gammaPeak(transcriptions, duration);

      const expected: Peak = {
        peak: 1,
        first: transcription,
        last: transcription,
        startDate: new Date((date - duration / 2) * 1000),
        endDate: new Date((date + duration / 2) * 1000),
      };

      expect(actual).toEqual(expected);
    });
    test('should include other transcription in timeframe', () => {
      const duration = 24 * 60 * 60; // 24h
      const transcriptions: Transcription[] = [
        new Transcription('a', imageMD, '', 1923019 + duration, 12, 'r/Old_Recipes'),
        new Transcription('b', imageMD, '', 1923019, 12, 'r/Old_Recipes'),
      ];
      const actual = gammaPeak(transcriptions, duration).peak;

      expect(actual).toBe(2);
    });
    test('should exclude other transcription outside the timeframe', () => {
      const duration = 24 * 60 * 60; // 24h
      const transcriptions: Transcription[] = [
        new Transcription('a', imageMD, '', 1923019 + duration + 1, 12, 'r/Old_Recipes'),
        new Transcription('b', imageMD, '', 1923019, 12, 'r/Old_Recipes'),
      ];
      const actual = gammaPeak(transcriptions, duration).peak;

      expect(actual).toBe(1);
    });
    test('should work for longer timeframes with oldest peak', () => {
      const duration = 24 * 60 * 60; // 24h
      const transcriptions = new TranscriptionGenerator(new Date('2020-10-03'))
        // Peak
        .addTranscriptions(100, duration)
        .addPause(duration / 2)
        .addTranscriptions(90, duration)
        .addPause(duration)
        .addTranscriptions(20, duration / 2)
        .generate();

      const actual = gammaPeak(transcriptions, duration).peak;

      expect(actual).toBe(100);
    });

    test('should work for longer timeframes with middle peak', () => {
      const duration = 24 * 60 * 60; // 24h
      const transcriptions = new TranscriptionGenerator(new Date('2020-10-03'))
        .addTranscriptions(50, duration)
        .addPause(duration / 2)
        // Peak
        .addTranscriptions(100, duration)
        .addPause(duration / 2)
        .addTranscriptions(90, duration)
        .generate();

      const actual = gammaPeak(transcriptions, duration).peak;

      expect(actual).toBe(100);
    });

    test('should work for longer timeframes with newest peak', () => {
      const duration = 24 * 60 * 60; // 24h
      const transcriptions = new TranscriptionGenerator(new Date('2020-10-03'))
        .addTranscriptions(50, duration)
        .addPause(duration / 2)
        .addTranscriptions(90, duration)
        .addPause(duration / 2)
        // Peak
        .addTranscriptions(100, duration)
        .generate();

      const actual = gammaPeak(transcriptions, duration).peak;

      expect(actual).toBe(100);
    });
  });
});
