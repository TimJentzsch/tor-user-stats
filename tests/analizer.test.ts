import { gammaAvg } from '../src/stats/avg';
import Transcription from '../src/transcription';
import { imageMD } from './transcription-templates';

describe('Analizer', () => {
  // Transcription average
  describe('gammaAvg', () => {
    test('should return count for larger timeframe', () => {
      const duration = 60 * 60; // 1h
      const transcriptions: Transcription[] = [
        new Transcription('a', imageMD, '', 1923019 + 20, 12, 'r/Old_Recipes'),
        new Transcription('b', imageMD, '', 1923019 + 10, 12, 'r/Old_Recipes'),
        new Transcription('c', imageMD, '', 1923019, 12, 'r/Old_Recipes'),
      ];
      const actual = gammaAvg(transcriptions, duration);

      expect(actual).toBe(3);
    });
    test('should return average for smaller timeframe', () => {
      const duration = 60 * 60; // 1h
      const transcriptions: Transcription[] = [
        new Transcription('a', imageMD, '', 1923019 + duration * 3, 12, 'r/Old_Recipes'),
        new Transcription('b', imageMD, '', 1923019 + duration * 2, 12, 'r/Old_Recipes'),
        new Transcription('c', imageMD, '', 1923019, 12, 'r/Old_Recipes'),
      ];
      const actual = gammaAvg(transcriptions, duration);

      // 3 transcriptions in 3h => 1 transcription in 1h
      expect(actual).toBe(1);
    });
  });
});
