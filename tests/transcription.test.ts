import RComment from '../src/comment';
import Transcription from '../src/transcription';
import { imageMD } from './transcription-templates';

describe('Transcription', () => {
  describe('isTranscription', () => {
    test('should reject r/TranscribersOfReddit posts', () => {
      const comment: RComment = {
        id: '1',
        body: imageMD,
        body_html: '',
        created_utc: new Date('2020-12-01').valueOf(),
        score: 1,
        subreddit_name_prefixed: 'r/TranscribersOfReddit',
      };

      const actual = Transcription.isTranscription(comment);

      expect(actual).toBe(false);
    });
    test('should reject r/kierra posts', () => {
      const comment: RComment = {
        id: '1',
        body: imageMD,
        body_html: '',
        created_utc: new Date('2020-12-01').valueOf(),
        score: 1,
        subreddit_name_prefixed: 'r/kierra',
      };

      const actual = Transcription.isTranscription(comment);

      expect(actual).toBe(false);
    });
  });
});
