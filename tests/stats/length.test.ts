import { getTranscriptionLength, TranscriptionLength } from '../../src/stats/length';
import Transcription from '../../src/transcription';
import { imageMD } from '../transcription-templates';

describe('Transcription length', () => {
  // Transcription length
  describe('getTranscriptionLength', () => {
    test('should return 0 for no transcriptions', () => {
      const transcriptions: Transcription[] = [];
      const expected: TranscriptionLength = {
        charAvg: 0,
        charPeak: 0,
        charTotal: 0,
        wordAvg: 0,
        wordPeak: 0,
        wordTotal: 0,
      };

      const actual = getTranscriptionLength(transcriptions);

      expect(actual).toEqual(expected);
    });

    test('should return length for single transcription', () => {
      const transcriptions: Transcription[] = [
        new Transcription(
          '1',
          '',
          imageMD,
          '',
          new Date('2020-11-01').valueOf() / 1000,
          1,
          'r/me_irl',
        ),
      ];
      const expected: TranscriptionLength = {
        charAvg: 359,
        charPeak: 359,
        charTotal: 359,
        wordAvg: 61,
        wordPeak: 61,
        wordTotal: 61,
      };

      const actual = getTranscriptionLength(transcriptions);

      expect(actual).toEqual(expected);
    });
  });
});
