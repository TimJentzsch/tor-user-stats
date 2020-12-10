// Eslint does not recognize the assertions in the help function
/* eslint-disable jest/expect-expect */
import { getCountTag } from '../../src/stats/tags';
import { countTags, Tag } from '../../src/tags';
import TranscriptionGenerator from '../transcription-generator';

/** Asserts that the given tag is assigned for the given count. */
function testCountTag(count: number, expected: Tag) {
  const transcriptions = new TranscriptionGenerator(new Date('2020-11-10'))
    .addTranscriptions(count, 24 * 60 * 60)
    .generate();
  const actual = getCountTag(transcriptions);

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
});
