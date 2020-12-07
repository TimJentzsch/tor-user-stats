import { fromTemplate } from '../../src/display/display-util';
import { heatmap, initHeatmap } from '../../src/stats/heatmap';
import Transcription from '../../src/transcription';
import { imageMD } from '../transcription-templates';

describe('Heatmap', () => {
  // Heatmap initilization
  describe('initHeatmap', () => {
    test('should be 0 for every entry', () => {
      const transcriptions: Transcription[] = [];
      const actual = heatmap(transcriptions);

      for (let d = 0; d < 7; d += 1) {
        for (let h = 0; h < 24; h += 1) {
          expect(actual[d][h]).toBe(0);
        }
      }
    });
  });
  // Heatmap
  describe('heatmap', () => {
    test('should be 0 for no transcriptions', () => {
      const transcriptions: Transcription[] = [];
      const actual = heatmap(transcriptions);
      const expected = initHeatmap();

      expect(expected).toEqual(actual);
    });

    test('should generate entry for single transcription', () => {
      // Tuesday, 13 h
      const date = new Date('2020-12-01T13:00:00Z');
      const transcriptions: Transcription[] = [
        new Transcription('1', imageMD, '', date.valueOf() / 1000, 1, 'r/Old_Recipes'),
      ];
      const actual = heatmap(transcriptions);

      const expected = fromTemplate(initHeatmap(), {
        2: { 13: 1 },
      });

      expect(actual).toEqual(expected);
    });
  });
});
