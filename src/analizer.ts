import { Comment } from 'snoowrap';
import Logger from './logger';
import { getAllUserComments, isToRMod } from './reddit-api';
import { subredditGamma, subredditKarma } from './stats/subreddits';
import { formatGamma, analyzeType, formatKarma } from './stats/type';
import { CountTag, specialTags, countTags, Tag } from './tags';
import Transcription from './transcription';
import { limitEnd } from './util';

const logger = new Logger('Analizer');

/** Checks if a comment is an actual comment instead of a ToR bot interaction. */
export function isComment(comment: Comment): boolean {
  return !(
    comment.subreddit_name_prefixed === 'r/TranscribersOfReddit' &&
    // Has one of the bot keywords
    /\b(done|(un)?claim(ing)?)\b/.test(comment.body)
  );
}

type PeakStats = {
  /** The number of transcriptions at the peak. */
  count: number;
  /** The start of the peak. */
  startDate: Date;
  /** The end of the peak. */
  endDate: Date;
};

/**
 * Gets the peak transcription count during the given duration.
 * @param transcriptions The transcriptions to analyze.
 * @param duration The duration to determine the peak in, in seconds.
 */
export function getTranscriptionPeak(transcriptions: Transcription[], duration: number): PeakStats {
  let peak = 0;
  let startDate = new Date();
  let endDate = new Date();

  if (transcriptions.length === 0) {
    return {
      count: peak,
      startDate,
      endDate,
    };
  }

  // Start with the oldest transcriptions
  let oldIndex = transcriptions.length - 1;
  let newIndex = transcriptions.length - 1;

  while (newIndex >= 0) {
    // Take as many transcriptions as fit into the timeframe
    while (
      newIndex >= 0 &&
      transcriptions[newIndex].createdUTC - transcriptions[oldIndex].createdUTC <= duration
    ) {
      newIndex -= 1;
    }
    // Count the transcriptions in that timeframe
    const count = oldIndex - newIndex;

    // Update the peak if necessary
    if (count > peak) {
      peak = count;
      startDate = new Date(transcriptions[oldIndex].createdUTC * 1000);
      endDate = new Date(transcriptions[newIndex + 1].createdUTC * 1000);
    }

    oldIndex -= 1;
  }

  return {
    count: peak,
    startDate,
    endDate,
  };
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
  for (let i = countTags.length - 1; i >= 0; i -= 1) {
    if (count >= countTags[i].lowerBound) {
      return countTags[i];
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
  if (dayPeak.count >= 100) {
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

export function logStats(label: string, stats: string): void {
  const logLabel = `${label}:`;

  logger.info(`${logLabel.padEnd(22)} ${stats}`);
}

/** Analizes the transcriptions of the given user. */
export default async function analizeUser(userName: string): Promise<void> {
  logger.debug(`Starting analysis for /u/${userName}:`);

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

    const count = `${newComments.length}`.padStart(3);

    logger.debug(`Fetched ${count} comments, from ${endDate} to ${startDate}`);
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
  logStats(
    'Counts',
    `All: ${allCount}, Comments: ${commentCount}, Transcriptions: ${transcriptionCount}`,
  );

  const accuracy = 2;

  // Peaks
  const hourPeak = getTranscriptionPeak(transcriptions, 60 * 60).count; // 1h
  const dayPeak = getTranscriptionPeak(transcriptions, 24 * 60 * 60).count; // 24h
  const weekPeak = getTranscriptionPeak(transcriptions, 7 * 24 * 60 * 60).count; // 7d
  const yearPeak = getTranscriptionPeak(transcriptions, 365 * 24 * 60 * 60).count; // 365d

  logStats('Peaks', `1h: ${hourPeak} | 24h: ${dayPeak} | 7d: ${weekPeak} | 365d: ${yearPeak}`);

  // Averages
  const hourAvg = getTranscriptionAvg(transcriptions, 60 * 60).toFixed(accuracy); // 1h
  const dayAvg = getTranscriptionAvg(transcriptions, 24 * 60 * 60).toFixed(accuracy); // 24h
  const weekAvg = getTranscriptionAvg(transcriptions, 7 * 24 * 60 * 60).toFixed(accuracy); // 7d
  const yearAvg = getTranscriptionAvg(transcriptions, 365 * 24 * 60 * 60).toFixed(accuracy); // 365d

  logStats('Avgs', `1h: ${hourAvg} | 24h: ${dayAvg} | 7d: ${weekAvg} | 365d: ${yearAvg}`);

  // Amounts
  const amounts = getTranscriptionAmount(transcriptions);

  logStats(
    'Chars',
    `Total: ${amounts.charTotal} | Peak: ${amounts.charPeak} | Average: ${amounts.charAvg.toFixed(
      2,
    )}`,
  );
  logStats(
    'Words',
    `Total: ${amounts.wordTotal} | Peak: ${amounts.wordPeak} | Average: ${amounts.wordAvg.toFixed(
      2,
    )}`,
  );

  // Fomat stats
  const formatGammaStats = limitEnd(formatGamma(transcriptions), 5).map((stats) => {
    return `${stats.format}: ${stats.count}`;
  });

  logStats('Top 5 formats (gamma)', `${formatGammaStats.join(' | ')}`);

  const formatKarmaStats = limitEnd(formatKarma(transcriptions), 5).map((stats) => {
    return `${stats.format}: ${stats.karma}`;
  });

  logStats('Top 5 formats (karma)', `${formatKarmaStats.join(' | ')}`);

  // Type stats
  const typeStats = limitEnd(analyzeType(transcriptions), 5).map((stats) => {
    return `${stats.type}: ${stats.count}`;
  });

  logStats('Top 5 types', `${typeStats.join(' | ')}`);

  // Sub stats
  const subGamma = limitEnd(subredditGamma(transcriptions), 5).map((stats) => {
    return `${stats.sub}: ${stats.count}`;
  });

  logStats('Top 5 subs (gamma)', `${subGamma.join(' | ')}`);

  const subKarma = limitEnd(subredditKarma(transcriptions), 5).map((stats) => {
    return `${stats.sub}: ${stats.karma}`;
  });

  logStats('Top 5 subs (karma)', `${subKarma.join(' | ')}`);

  // Tags
  const countTag = getCountTag(transcriptions);
  const countText = `${countTag.name} (${countTag.lowerBound}-${countTag.upperBound})`;

  const spTags = await getSpecialTags(userName, transcriptions);
  const spText = spTags.map((tag) => tag.name);

  const tagText = [countText].concat(spText).join(' | ');

  logStats('Tags', `${tagText}`);
}
