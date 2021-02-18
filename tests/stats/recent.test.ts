import Durations from '../../src/durations';
import { RecentStats, recentGamma } from '../../src/stats/recent';
import Transcription from '../../src/transcription';
import { imageMD } from '../transcription-templates';

describe('Transcription Recent Stats', () => {
  // Transcription recent stats
  describe('recentGamma', () => {
    test('should return 0 for empty array', () => {
      const transcriptions: Transcription[] = [];
      const duration = Durations.day; // 24h
      const actual = recentGamma(transcriptions, duration);
      const expected: RecentStats = {
        score: 0,
      };

      expect(actual).toEqual(expected);
    });
    test('should return for one transcription in timeframe', () => {
      const transcription = new Transcription(
        'a',
        '',
        imageMD,
        '',
        Date.now() / 1000,
        12,
        'r/Old_Recipes',
      );
      const transcriptions: Transcription[] = [transcription];
      const duration = Durations.day; // 24h

      const actual = recentGamma(transcriptions, duration);

      const expected: RecentStats = {
        score: 1,
      };

      expect(actual).toEqual(expected);
    });
    test('should include other transcription in timeframe', () => {
      const duration = Durations.day; // 24h
      const transcriptions: Transcription[] = [
        new Transcription('a', '', imageMD, '', Date.now() / 1000, 12, 'r/Old_Recipes'),
        new Transcription(
          'b',
          '',
          imageMD,
          '',
          Date.now() / 1000 - duration / 2,
          12,
          'r/Old_Recipes',
        ),
      ];
      const actual = recentGamma(transcriptions, duration).score;

      expect(actual).toBe(2);
    });
    test('should exclude other transcription outside the timeframe', () => {
      const duration = Durations.day; // 24h
      const transcriptions: Transcription[] = [
        new Transcription('a', '', imageMD, '', Date.now() / 1000, 12, 'r/Old_Recipes'),
        new Transcription(
          'b',
          '',
          imageMD,
          '',
          Date.now() / 1000 - 2 * duration,
          12,
          'r/Old_Recipes',
        ),
      ];
      const actual = recentGamma(transcriptions, duration).score;

      expect(actual).toBe(1);
    });
  });
});
