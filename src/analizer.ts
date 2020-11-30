import { Comment } from 'snoowrap';
import Logger from './logger';
import { getAllUserComments } from './reddit-api';
import Transcription from './transcription';

const logger = new Logger('Analizer');

/** Checks if a comment is an actual comment instead of a ToR bot interaction. */
function isComment(comment: Comment): boolean {
  return !(
    comment.subreddit_name_prefixed === 'r/TranscribersOfReddit' &&
    // Has one of the bot keywords
    /\b(done|(un)?claim(ing)?)\b/.test(comment.body)
  );
}

/**
 * Gets the peak transcription count during the given duration.
 * @param transcriptions The transcriptions to analyze.
 * @param duration The duration to determine the peak in, in seconds.
 */
export function getTranscriptionPeak(transcriptions: Transcription[], duration: number): number {
  let peak = 0;

  for (let anchorIndex = 0; anchorIndex < transcriptions.length; anchorIndex += 1) {
    // Take one transcription as anchor
    const anchor = transcriptions[anchorIndex];
    const anchorTime = anchor.createdUTC;
    let counter = 0;

    // Count all transcriptions that are within the given timeframe
    for (let index = anchorIndex; index < transcriptions.length; index += 1) {
      const cur = transcriptions[index];
      const curTime = cur.createdUTC;

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

/**
 * Gets the average number of transcriptions made in the given timeframe.
 * @param transcriptions The transcriptions to analyze.
 * @param duration The duration to get the average for, in seconds.
 */
export function getTranscriptionAvg(transcriptions: Transcription[], duration: number): number {
  const count = transcriptions.length;

  // Check if transcriptions have been made
  if (count === 0) {
    return 0;
  }

  const transcriptionStart = transcriptions[transcriptions.length - 1].createdUTC;
  const transcriptionEnd = transcriptions[0].createdUTC;
  const transcriptionDur = transcriptionEnd - transcriptionStart;

  // If the timeframe is larger than the transcription frame, return the number of transcriptions
  if (transcriptionDur <= duration) {
    return count;
  }

  // Return the avg count of transcriptions in the given timeframe
  return (duration / transcriptionDur) * count;
}

/** Analizes the transcriptions of the given user. */
export default async function analizeUser(userName: string): Promise<void> {
  let allCount = 0;
  let commentCount = 0;
  let transcriptionCount = 0;

  let transcriptions: Transcription[] = [];

  await getAllUserComments(userName, (newComments) => {
    logger.debug(`Fetched ${newComments.length} comments`);
    allCount += newComments.length;

    const newValidComments = newComments.filter((comment) => isComment(comment));
    commentCount += newValidComments.length;

    const newTranscriptions = newValidComments
      .filter((comment) => Transcription.isTranscription(comment))
      .map((comment) => Transcription.fromComment(comment));
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
