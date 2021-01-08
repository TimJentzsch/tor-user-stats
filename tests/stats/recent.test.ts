import { RecentStats, recentGamma, recentKarma } from '../../src/stats/recent';
import Transcription from '../../src/transcription';
import TranscriptionGenerator from '../transcription-generator';
import { imageMD } from '../transcription-templates';

describe('Transcription Recent Stats', () => {
  // Transcription recent stats
  describe('recentGamma', () => {
    test('should return 0 for empty array', () => {
      const transcriptions: Transcription[] = [];
      const duration = 24 * 60 * 60; // 24h
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
        Date.now(),
        12,
        'r/Old_Recipes',
      );
      const transcriptions: Transcription[] = [transcription];
      const duration = 24 * 60 * 60; // 24h

      const actual = recentGamma(transcriptions, duration);

      const expected: RecentStats = {
        score: 1,
      };

      expect(actual).toEqual(expected);
    });
    test('should include other transcription in timeframe', () => {
      const duration = 24 * 60 * 60; // 24h
      const transcriptions: Transcription[] = [
        new Transcription('a', '', imageMD, '', Date.now(), 12, 'r/Old_Recipes'),
        new Transcription('b', '', imageMD, '', Date.now() - duration / 2, 12, 'r/Old_Recipes'),
      ];
      const actual = recentGamma(transcriptions, duration).score;

      expect(actual).toBe(2);
    });
    test('should exclude other transcription outside the timeframe', () => {
      const duration = 24 * 60 * 60; // 24h
      const transcriptions: Transcription[] = [
        new Transcription('a', '', imageMD, '', Date.now(), 12, 'r/Old_Recipes'),
        new Transcription('b', '', imageMD, '', Date.now() - 2 * duration, 12, 'r/Old_Recipes'),
      ];
      const actual = recentGamma(transcriptions, duration).score;

      expect(actual).toBe(1);
    });
  });
});
