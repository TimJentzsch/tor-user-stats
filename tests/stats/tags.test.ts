// Eslint does not recognize the assertions in the help function
/* eslint-disable jest/expect-expect */
import { getBetaTesterTag, getCountTag, getTwentyFourTag } from '../../src/stats/tags';
import { countTags, specialTags, Tag } from '../../src/tags';
import Transcription from '../../src/transcription';
import TranscriptionGenerator from '../transcription-generator';

/** Asserts that the given tag is assigned for the given count. */
function testCountTag(count: number, expected: Tag) {
  const transcriptions = new TranscriptionGenerator(new Date('2020-11-10'))
    .addTranscriptions(count, 24 * 60 * 60)
    .generate();
  const actual = getCountTag(transcriptions.length);

  expect(actual).toEqual(expected);
}

describe('Tag Stats', () => {
  // Count tags
  describe('getCountTag', () => {
    test('should return Vistor for 0', () => {
      testCountTag(0, countTags.visitor);
    });
    test('should return Initiate for 1', () => {
      testCountTag(1, countTags.initiate);
    });
    test('should return Green for 50', () => {
      testCountTag(50, countTags.green);
    });
    test('should return Teal for 100', () => {
      testCountTag(100, countTags.teal);
    });
    test('should return Purple for 250', () => {
      testCountTag(250, countTags.purple);
    });
    test('should return Gold for 500', () => {
      testCountTag(500, countTags.gold);
    });
    test('should return Diamond for 1000', () => {
      testCountTag(1000, countTags.diamond);
    });
    test('should return Ruby for 2500', () => {
      testCountTag(2500, countTags.ruby);
    });
    test('should return Topaz for 5000', () => {
      testCountTag(5000, countTags.topaz);
    });
    test('should return Jade for 10000', () => {
      testCountTag(10000, countTags.jade);
    });
  });
  // 100/24h tag
  describe('getTwentyFourTag', () => {
    test('should return tag for 100 transcriptions in 24h', () => {
      const transcriptions = new TranscriptionGenerator(new Date('2020-11-01'))
        .addTranscriptions(100, 24 * 60 * 60)
        .generate();
      const expected = specialTags.twentyFour;
      const actual = getTwentyFourTag(transcriptions);

      expect(actual).toEqual(expected);
    });

    test('should return null for 50 transcriptions in 24h', () => {
      const transcriptions = new TranscriptionGenerator(new Date('2020-11-01'))
        .addTranscriptions(50, 24 * 60 * 60)
        .generate();
      const expected = null;
      const actual = getTwentyFourTag(transcriptions);

      expect(actual).toEqual(expected);
    });

    test('should return null for 100 transcriptions in 48h', () => {
      const transcriptions = new TranscriptionGenerator(new Date('2020-11-01'))
        .addTranscriptions(100, 48 * 60 * 60)
        .generate();
      const expected = null;
      const actual = getTwentyFourTag(transcriptions);

      expect(actual).toEqual(expected);
    });
  });
  // Beta tester tag
  describe('getBetaTesterTag', () => {
    test('should return tag for transcription on 2020-10-01', () => {
      const transcriptions = new TranscriptionGenerator(new Date('2020-10-01'))
        .addTranscriptions(1, 0)
        .generate();
      const expected = specialTags.betaTester;
      const actual = getBetaTesterTag(transcriptions);

      expect(actual).toEqual(expected);
    });

    test('should return null for no transcriptions', () => {
      const transcriptions: Transcription[] = [];
      const expected = null;
      const actual = getBetaTesterTag(transcriptions);

      expect(actual).toEqual(expected);
    });

    test('should return null for transcription on 2022-01-01', () => {
      const transcriptions = new TranscriptionGenerator(new Date('2022-01-01'))
        .addTranscriptions(1, 0)
        .generate();
      const expected = null;
      const actual = getBetaTesterTag(transcriptions);

      expect(actual).toEqual(expected);
    });

    test('should return tag for transcriptions before and after beta end', () => {
      const transcriptions = new TranscriptionGenerator(new Date('2020-10-01'))
        .addTranscriptions(1, 2 * 365 * 24 * 60 * 60) // 2 years
        .generate();
      const expected = specialTags.betaTester;
      const actual = getBetaTesterTag(transcriptions);

      expect(actual).toEqual(expected);
    });
  });
});
