import { Comment } from 'snoowrap';
import Logger from './logger';
import { getAllUserComments } from './reddit-api';

const logger = new Logger('Analizer');

/** Checks if a comment is an actual comment instead of a ToR bot interaction. */
function isComment(comment: Comment): boolean {
  return !(
    comment.subreddit_name_prefixed === 'r/TranscribersOfReddit' &&
    // Has one of the bot keywords
    /\b(done|(un)?claim(ing)?)\b/.test(comment.body)
  );
}

/** Checks if a comment is a transcription. */
function isTranscription(comment: Comment): boolean {
  // Recognizes the ToR footer. Note that there is an extra optional space, needed due to a malformed template
  const footerRegex = /\^\^I'm&#32;a&#32;human&#32;volunteer&#32;content&#32;transcriber&#32;for&#32;Reddit&#32;and&#32;you&#32;could&#32;be&#32;too!&#32;\[If&#32;(&#32;)?you'd&#32;like&#32;more&#32;information&#32;on&#32;what&#32;we&#32;do&#32;and&#32;why&#32;we&#32;do&#32;it,&#32;click&#32;here!\]\(https:\/\/www\.reddit\.com\/r\/TranscribersOfReddit\/wiki\/index\)/;

  // Check if the comment ends with the footer
  return footerRegex.test(comment.body);
}

/**
 * Gets the peak transcription count during the given duration.
 * @param transcriptions The transcriptions to analyze.
 * @param duration The duration to determine the peak in, in seconds.
 */
function getTranscriptionPeak(transcriptions: Comment[], duration: number): number {
  let peak = 0;

  for (let anchorIndex = 0; anchorIndex < transcriptions.length; anchorIndex += 1) {
    // Take one transcription as anchor
    const anchor = transcriptions[anchorIndex];
    const anchorTime = anchor.created_utc;
    let counter = 0;

    // Count all transcriptions that are within the given timeframe
    for (let index = anchorIndex; index < transcriptions.length; index += 1) {
      const cur = transcriptions[index];
      const curTime = cur.created_utc;

      const timeDiff = anchorTime - curTime;

      // Check if the post is within the given timeframe
      if (timeDiff <= duration) {
        counter += 1;
      } else {
        break;
      }
    }

    // Update the maximum if necessary
    if (counter > peak) {
      peak = counter;
    }
  }

  return peak;
}

/** Analizes the transcriptions of the given user. */
export default async function analizeUser(userName: string): Promise<void> {
  let allCount = 0;
  let commentCount = 0;
  let transcriptionCount = 0;

  let transcriptions: Comment[] = [];

  await getAllUserComments(userName, (newComments) => {
    logger.debug(`Fetched ${newComments.length} comments`);
    allCount += newComments.length;

    const newValidComments = newComments.filter((comment) => isComment(comment));
    commentCount += newValidComments.length;

    const newTranscriptions = newValidComments.filter((comment) => isTranscription(comment));
    transcriptionCount += newTranscriptions.length;

    transcriptions = transcriptions.concat(newTranscriptions);
  });

  logger.info(
    `All comments fetched. All: ${allCount}, Comments: ${commentCount}, Transcriptions: ${transcriptionCount}`,
  );

  const hourPeak = getTranscriptionPeak(transcriptions, 60 * 60); // 1h
  const dayPeak = getTranscriptionPeak(transcriptions, 24 * 60 * 60); // 24h
  const weekPeak = getTranscriptionPeak(transcriptions, 7 * 24 * 60 * 60); // 7d
  const yearPeak = getTranscriptionPeak(transcriptions, 365 * 24 * 60 * 60); // 365d

  logger.info(`Peaks: 1h: ${hourPeak} | 24h: ${dayPeak} | 7d: ${weekPeak} | 365d: ${yearPeak}`);
}
