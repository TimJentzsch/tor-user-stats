import { GammaPrediction, predictUntilGamma } from '../../src/stats/rank-prediction';
import TranscriptionGenerator from '../transcription-generator';

describe('Transcription Rank Prediction Stats', () => {
  describe('predictUntilGamma', () => {
    test('should correctly predict for complete rate', () => {
      const duration = 60 * 60; // 1 hour
      const target = 10;

      const transcriptions = new TranscriptionGenerator(new Date(Date.now() - duration))
        .addTranscriptions(2, duration)
        .generate();

      const actual = predictUntilGamma(transcriptions, duration, target);

      const expected: GammaPrediction = {
        duration: 4 * 60 * 60, // 4 hours
        rate: 2,
        target,
      };

      expect(actual).toEqual(expected);
    });
  });
});
