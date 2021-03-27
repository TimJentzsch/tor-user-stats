import RComment from '../src/comment';
import Transcription from '../src/transcription';
import { imageMD, imageMDApr1, imageMDBugged, imageMDOld } from './transcription-templates';

describe('Transcription', () => {
  describe('isTranscription', () => {
    test('should reject r/TranscribersOfReddit posts', () => {
      const comment: RComment = {
        id: '1',
        permalink: '',
        body: imageMD,
        body_html: '',
        created_utc: new Date('2020-12-01').valueOf() / 1000,
        score: 1,
        subreddit_name_prefixed: 'r/TranscribersOfReddit',
      };

      const actual = Transcription.isTranscription(comment);

      expect(actual).toBe(false);
    });
    test('should reject r/kierra posts', () => {
      const comment: RComment = {
        id: '1',
        permalink: '',
        body: imageMD,
        body_html: '',
        created_utc: new Date('2020-12-01').valueOf() / 1000,
        score: 1,
        subreddit_name_prefixed: 'r/kierra',
      };

      const actual = Transcription.isTranscription(comment);

      expect(actual).toBe(false);
    });
    test('should reject mod welcoming comment', () => {
      const comment: RComment = {
        id: '1',
        permalink: '',
        body: `Welcome, /u/username! We like to check in, welcome you to the team, and give you some feedback. Your first transcription is a great start -- there’s just one thing we need to clean up to make it top-notch.

        You should have thematic breaks separating the transcription from the header and footer. You can write a thematic break in markdown as "---" with an empty line above and below, like so:
        
            Header
            
            ---
            
            Transcription
            
            ---
            
            Footer
        
        If you could clean that up for me, that'd be perfect. If you have any questions or issues, feel free to reach out to us through modmail (https://old.reddit.com/message/compose/?to=/r/TranscribersOfReddit), join our Discord (https://discord.gg/ZDDE3Pj) for instant feedback on transcriptions and such and to read our step-by-step tutorial (https://old.reddit.com/r/TranscribersOfReddit/wiki/tutorial), explaining how to transcribe in detail.
        
        Cheers and welcome to the crew!`,
        body_html: '',
        created_utc: new Date('2020-12-01').valueOf() / 1000,
        score: 1,
        subreddit_name_prefixed: 'r/TranscribersOfReddit',
      };

      const actual = Transcription.isTranscription(comment);

      expect(actual).toBe(false);
    });
    test('should accept post with standard footer', () => {
      const comment: RComment = {
        id: '1',
        permalink: '',
        body: imageMD,
        body_html: '',
        created_utc: new Date('2020-12-01').valueOf() / 1000,
        score: 1,
        subreddit_name_prefixed: 'r/CuratedTumblr',
      };

      const actual = Transcription.isTranscription(comment);

      expect(actual).toBe(true);
    });
    test('should accept post with old footer', () => {
      const comment: RComment = {
        id: '1',
        permalink: '',
        body: imageMDOld,
        body_html: '',
        created_utc: new Date('2020-12-01').valueOf() / 1000,
        score: 1,
        subreddit_name_prefixed: 'r/CuratedTumblr',
      };

      const actual = Transcription.isTranscription(comment);

      expect(actual).toBe(true);
    });
    test('should accept post with bugged footer', () => {
      const comment: RComment = {
        id: '1',
        permalink: '',
        body: imageMDBugged,
        body_html: '',
        created_utc: new Date('2020-12-01').valueOf() / 1000,
        score: 1,
        subreddit_name_prefixed: 'r/CuratedTumblr',
      };

      const actual = Transcription.isTranscription(comment);

      expect(actual).toBe(true);
    });
    test('should reject post with relaxed footer', () => {
      const comment: RComment = {
        id: '1',
        permalink: '',
        body: imageMDApr1,
        body_html: '',
        created_utc: new Date('2020-12-01').valueOf() / 1000,
        score: 1,
        subreddit_name_prefixed: 'r/CuratedTumblr',
      };

      const actual = Transcription.isTranscription(comment);

      expect(actual).toBe(false);
    });
    test('should accept post with relaxed footer on April 1st', () => {
      const comment: RComment = {
        id: '1',
        permalink: '',
        body: imageMDApr1,
        body_html: '',
        created_utc: new Date('2020-04-01').valueOf() / 1000,
        score: 1,
        subreddit_name_prefixed: 'r/CuratedTumblr',
      };

      const actual = Transcription.isTranscription(comment);

      expect(actual).toBe(true);
    });
  });
});
