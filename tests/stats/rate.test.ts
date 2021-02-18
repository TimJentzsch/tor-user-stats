import Durations from '../../src/durations';
import { gammaRate, RateStats } from '../../src/stats/rate';
import Transcription from '../../src/transcription';
import TranscriptionGenerator from '../transcription-generator';
import { imageMD } from '../transcription-templates';

describe('Transcription Rate', () => {
  describe('gammaRate', () => {
    test('should return empty array for no transcriptions', () => {
      const duration = Durations.day; // 24h
      const transcriptions: Transcription[] = [];

      const actual = gammaRate(transcriptions, duration);
      const expected: RateStats[] = [];

      expect(actual).toEqual(expected);
    });
    test('should return 1 for one transcription', () => {
      const duration = Durations.day; // 24h
      const transcriptions = [
        new Transcription(
          '1',
          '',
          imageMD,
          '',
          new Date('2020-11-01T00:00:00').valueOf() / 1000,
          1,
          'r/Old_Recipes',
        ),
      ];

      const actual = gammaRate(transcriptions, duration);
      const expected: RateStats[] = [
        {
          date: new Date('2020-11-01T00:00:00'),
          rate: 1,
        },
      ];

      expect(actual).toEqual(expected);
    });
    test('should return 2 with center for two transcriptions', () => {
      const duration = Durations.day; // 24h
      const transcriptions = new TranscriptionGenerator(new Date('2020-11-03T00:00:00'))
        .addTranscriptions(2, duration)
        .generate();

      const actual = gammaRate(transcriptions, duration);
      const expected: RateStats[] = [
        {
          date: new Date('2020-11-03T12:00:00'),
          rate: 2,
        },
      ];

      expect(actual).toEqual(expected);
    });
  });
});
