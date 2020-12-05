import { getTranscriptionAvg } from '../src/stats/avg';
import { getTranscriptionPeak } from '../src/stats/peak';
import Transcription from '../src/transcription';
import TranscriptionGenerator from './transcription-generator';
import { imageMD } from './transcription-templates';

describe('Analizer', () => {
  // Transcription peak
  describe('getTranscriptionPeak', () => {
    test('should return 0 for empty array', () => {
      const transcriptions: Transcription[] = [];
      const duration = 24 * 60 * 60; // 24h
      const actual = getTranscriptionPeak(transcriptions, duration).count;

      expect(actual).toBe(0);
    });
    test('should return 1 for one element array', () => {
      const transcriptions: Transcription[] = [
        new Transcription('a', imageMD, '', 1923019, 12, 'r/Old_Recipes'),
      ];
      const duration = 24 * 60 * 60; // 24h
      const actual = getTranscriptionPeak(transcriptions, duration).count;

      expect(actual).toBe(1);
    });
    test('should include other transcription in timeframe', () => {
      const duration = 24 * 60 * 60; // 24h
      const transcriptions: Transcription[] = [
        new Transcription('a', imageMD, '', 1923019 + duration, 12, 'r/Old_Recipes'),
        new Transcription('b', imageMD, '', 1923019, 12, 'r/Old_Recipes'),
      ];
      const actual = getTranscriptionPeak(transcriptions, duration).count;

      expect(actual).toBe(2);
    });
    test('should exclude other transcription outside the timeframe', () => {
      const duration = 24 * 60 * 60; // 24h
      const transcriptions: Transcription[] = [
        new Transcription('a', imageMD, '', 1923019 + duration + 1, 12, 'r/Old_Recipes'),
        new Transcription('b', imageMD, '', 1923019, 12, 'r/Old_Recipes'),
      ];
      const actual = getTranscriptionPeak(transcriptions, duration).count;

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

      const actual = getTranscriptionPeak(transcriptions, duration).count;

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

      const actual = getTranscriptionPeak(transcriptions, duration).count;

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

      const actual = getTranscriptionPeak(transcriptions, duration).count;

      expect(actual).toBe(100);
    });
  });
  // Transcription average
  describe('getTranscriptionAvg', () => {
    test('should return count for larger timeframe', () => {
      const duration = 60 * 60; // 1h
      const transcriptions: Transcription[] = [
        new Transcription('a', imageMD, '', 1923019 + 20, 12, 'r/Old_Recipes'),
        new Transcription('b', imageMD, '', 1923019 + 10, 12, 'r/Old_Recipes'),
        new Transcription('c', imageMD, '', 1923019, 12, 'r/Old_Recipes'),
      ];
      const actual = getTranscriptionAvg(transcriptions, duration);

      expect(actual).toBe(3);
    });
    test('should return average for smaller timeframe', () => {
      const duration = 60 * 60; // 1h
      const transcriptions: Transcription[] = [
        new Transcription('a', imageMD, '', 1923019 + duration * 3, 12, 'r/Old_Recipes'),
        new Transcription('b', imageMD, '', 1923019 + duration * 2, 12, 'r/Old_Recipes'),
        new Transcription('c', imageMD, '', 1923019, 12, 'r/Old_Recipes'),
      ];
      const actual = getTranscriptionAvg(transcriptions, duration);

      // 3 transcriptions in 3h => 1 transcription in 1h
      expect(actual).toBe(1);
    });
  });
});
