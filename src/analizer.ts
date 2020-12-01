import { Comment } from 'snoowrap';
import Logger from './logger';
import { getAllUserComments, isToRMod } from './reddit-api';
import { CountTag, specialTags, countTags, Tag } from './tags';
import Transcription from './transcription';
import { limitStart } from './util';

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

/**
 * Gets the matching count tag for the transcriptions.
 * @param transcriptions The transcriptions to analize.
 */
export function getCountTag(transcriptions: Transcription[]): CountTag {
  const count = transcriptions.length;

  // From the highest tag downwards, search for the first match
  for (const countTag of countTags.reverse()) {
    if (count >= countTag.lowerBound) {
      return countTag;
    }
  }

  throw new Error(`No count tag found for count ${count}`);
}

/**
 * Returns all special tags for the given user.
 * @param userName The user to check the special tags for.
 * @param transcriptions The transcriptions of the user.
 */
export async function getSpecialTags(
  userName: string,
  transcriptions: Transcription[],
): Promise<Tag[]> {
  const spTags: Tag[] = [];

  const isMod = await isToRMod(userName);

  // Mod tag
  if (isMod) {
    spTags.push(specialTags.mod);
  }

  const dayPeak = getTranscriptionPeak(transcriptions, 24 * 60 * 60); // 24h

  // 100/24h tag
  if (dayPeak >= 100) {
    spTags.push(specialTags.twentyFour);
  }

  return spTags;
}

type TranscriptionAmount = {
  /** The total number of characters. */
  charTotal: number;
  /** The average number of characters. */
  charAvg: number;
  /** The maximum amount of characters. */
  charPeak: number;
  /** The total number of words. */
  wordTotal: number;
  /** The average number of words. */
  wordAvg: number;
  /** The maximum amount of words. */
  wordPeak: number;
};

/**
 * Analyzes the character and word count of the transcriptions.
 * @param transcriptions The transcriptions to analize.
 */
export function getTranscriptionAmount(transcriptions: Transcription[]): TranscriptionAmount {
  const count = transcriptions.length;

  let charTotal = 0;
  let charPeak = 0;
  let wordTotal = 0;
  let wordPeak = 0;

  transcriptions.forEach((transcrition) => {
    // Determine character and word count of this transcriptions
    const charCount = transcrition.contentMD.length;
    const wordCount = transcrition.contentMD.split(/\s+/).length;

    charTotal += charCount;
    charPeak = Math.max(charPeak, charCount);

    wordTotal += wordCount;
    wordPeak = Math.max(wordPeak, wordCount);
  });

  return {
    charTotal,
    charAvg: charTotal / count,
    charPeak,
    wordTotal,
    wordAvg: wordTotal / count,
    wordPeak,
  };
}

type SubStats = {
  /** The name of the subreddit. */
  sub: string;
  /** The number of transcriptions for the subreddit. */
  count: number;
};

/**
 * Analyzes the subreddits of the transcriptions.
 * @param transcriptions The transcriptions to analyze.
 */
export function analyzeSubreddits(transcriptions: Transcription[]): SubStats[] {
  const subStats: SubStats[] = [];

  transcriptions.forEach((transcription) => {
    const sub = transcription.subredditNamePrefixed;

    const stats = subStats.find((stat) => {
      return stat.sub === sub;
    });

    if (stats) {
      stats.count += 1;
    } else {
      subStats.push({
        sub,
        count: 1,
      });
    }
  });

  // Sort by count descending
  return subStats.sort((a, b) => {
    return b.count - a.count;
  });
}

type FormatStats = {
  /** The name of the format. */
  format: string;
  /** The number of transcriptions for the format. */
  count: number;
};

/**
 * Analyzes the given transcriptions by the format, e.g. 'Image' or 'Video'.
 * @param transcriptions The transcriptions to analyze.
 */
export function analyzeFormat(transcriptions: Transcription[]) {
  const formatStats: FormatStats[] = [];

  transcriptions.forEach((transcription) => {
    const format = transcription.format;

    const stats = formatStats.find((stat) => {
      return stat.format === format;
    });

    if (stats) {
      stats.count += 1;
    } else {
      formatStats.push({
        format,
        count: 1,
      });
    }
  });

  // Sort by count descending
  return formatStats.sort((a, b) => {
    return b.count - a.count;
  });
}

/** Analizes the transcriptions of the given user. */
export default async function analizeUser(userName: string): Promise<void> {
  let allCount = 0;
  let commentCount = 0;
  let transcriptionCount = 0;

  let transcriptions: Transcription[] = [];

  await getAllUserComments(userName, (newComments) => {
    if (newComments.length === 0) {
      return;
    }

    const endDate = new Date(newComments[0].created_utc * 1000).toISOString();
    const startDate = new Date(
      newComments[newComments.length - 1].created_utc * 1000,
    ).toISOString();

    logger.debug(`Fetched ${newComments.length} comments, from ${endDate} to ${startDate}`);
    allCount += newComments.length;

    const newValidComments = newComments.filter((comment) => isComment(comment));
    commentCount += newValidComments.length;

    const newTranscriptions = newValidComments
      .filter((comment) => Transcription.isTranscription(comment))
      .map((comment) => Transcription.fromComment(comment));
    transcriptionCount += newTranscriptions.length;

    transcriptions = transcriptions.concat(newTranscriptions);
  });

  logger.info(`Analysis for /u/${userName}:`);
  logger.info(`All: ${allCount}, Comments: ${commentCount}, Transcriptions: ${transcriptionCount}`);

  const accuracy = 2;

  // Peaks
  const hourPeak = getTranscriptionPeak(transcriptions, 60 * 60); // 1h
  const dayPeak = getTranscriptionPeak(transcriptions, 24 * 60 * 60); // 24h
  const weekPeak = getTranscriptionPeak(transcriptions, 7 * 24 * 60 * 60); // 7d
  const yearPeak = getTranscriptionPeak(transcriptions, 365 * 24 * 60 * 60); // 365d

  logger.info(`Peaks: 1h: ${hourPeak} | 24h: ${dayPeak} | 7d: ${weekPeak} | 365d: ${yearPeak}`);

  // Averages
  const hourAvg = getTranscriptionAvg(transcriptions, 60 * 60).toFixed(accuracy); // 1h
  const dayAvg = getTranscriptionAvg(transcriptions, 24 * 60 * 60).toFixed(accuracy); // 24h
  const weekAvg = getTranscriptionAvg(transcriptions, 7 * 24 * 60 * 60).toFixed(accuracy); // 7d
  const yearAvg = getTranscriptionAvg(transcriptions, 365 * 24 * 60 * 60).toFixed(accuracy); // 365d

  logger.info(`Avgs: 1h: ${hourAvg} | 24h: ${dayAvg} | 7d: ${weekAvg} | 365d: ${yearAvg}`);

  // Amounts
  const amounts = getTranscriptionAmount(transcriptions);

  logger.info(
    `Characters: Total: ${amounts.charTotal} | Peak: ${amounts.charPeak} | Average: ${amounts.charAvg}`,
  );
  logger.info(
    `Words:      Total: ${amounts.wordTotal} | Peak: ${amounts.wordPeak} | Average: ${amounts.wordAvg}`,
  );

  // Fomat stats
  const formatStats = limitStart(analyzeFormat(transcriptions), 5).map((stats) => {
    return `${stats.format}: ${stats.count}`;
  });

  logger.info(`Top 5 formats: ${formatStats.join(' | ')}`);

  // Sub stats
  const subStats = limitStart(analyzeSubreddits(transcriptions), 5).map((stats) => {
    return `${stats.sub}: ${stats.count}`;
  });

  logger.info(`Top 5 subs:    ${subStats.join(' | ')}`);

  // Tags
  const countTag = getCountTag(transcriptions);
  const countText = `${countTag.name} (${countTag.lowerBound}-${countTag.upperBound})`;

  const spTags = await getSpecialTags(userName, transcriptions);
  const spText = spTags.map((tag) => tag.name);

  const tagText = [countText].concat(spText).join(' | ');

  logger.info(`Tags: ${tagText}`);
}
