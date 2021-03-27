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
      const expected = {
        entries: 0,
        heat: 0,
      };

      for (let d = 0; d < 7; d += 1) {
        for (let h = 0; h < 24; h += 1) {
          expect(actual[d][h]).toEqual(expected);
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

    test('should generate entry for single transcription for Tue 13h', () => {
      // Tuesday, 13 h
      const date = new Date('2020-12-01T13:00:00Z');
      const transcriptions: Transcription[] = [
        new Transcription('1', '', imageMD, '', date.valueOf() / 1000, 1, 'r/Old_Recipes'),
      ];
      const actual = heatmap(transcriptions);

      const expected = fromTemplate(initHeatmap(), {
        1: { 13: { entries: 1, heat: 1 } },
      });

      expect(actual).toEqual(expected);
    });

    test('should generate entry for single transcription for Fri 17h', () => {
      // Friday, 17:30 h
      const date = new Date('2021-03-26T17:30:00Z');
      const transcriptions: Transcription[] = [
        new Transcription('1', '', imageMD, '', date.valueOf() / 1000, 1, 'r/Old_Recipes'),
      ];
      const actual = heatmap(transcriptions);

      const expected = fromTemplate(initHeatmap(), {
        4: { 17: { entries: 1, heat: 1 } },
      });

      expect(actual).toEqual(expected);
    });
  });
});
