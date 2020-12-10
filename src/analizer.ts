import { Comment } from 'snoowrap';
import Logger from './logger';
import { getAllUserComments, isToRMod } from './reddit-api';
import { gammaAvg, karmaAvg } from './stats/avg';
import { gammaPeak, karmaPeak } from './stats/peak';
import { subredditGamma, subredditKarma } from './stats/subreddits';
import { getCountTag, getModTag, getSpecialTags } from './stats/tags';
import { formatGamma, typeGamma, formatKarma, typeKarma } from './stats/type';
import { CountTag, specialTags, countTagList, Tag } from './tags';
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
  if (transcriptions.length === 0) {
    return {
      charTotal: 0,
      charAvg: 0,
      charPeak: 0,
      wordTotal: 0,
      wordAvg: 0,
      wordPeak: 0,
    };
  }

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
  const gammaHourPeak = gammaPeak(transcriptions, 60 * 60).peak; // 1h
  const gammaDayPeak = gammaPeak(transcriptions, 24 * 60 * 60).peak; // 24h
  const gammaWeekPeak = gammaPeak(transcriptions, 7 * 24 * 60 * 60).peak; // 7d
  const gammaYearPeak = gammaPeak(transcriptions, 365 * 24 * 60 * 60).peak; // 365d

  logStats(
    'Peaks (gamma)',
    `1h: ${gammaHourPeak} | 24h: ${gammaDayPeak} | 7d: ${gammaWeekPeak} | 365d: ${gammaYearPeak}`,
  );

  const karmaHourPeak = karmaPeak(transcriptions, 60 * 60).peak; // 1h
  const karmaDayPeak = karmaPeak(transcriptions, 24 * 60 * 60).peak; // 24h
  const karmaWeekPeak = karmaPeak(transcriptions, 7 * 24 * 60 * 60).peak; // 7d
  const karmaYearPeak = karmaPeak(transcriptions, 365 * 24 * 60 * 60).peak; // 365d

  logStats(
    'Peaks (karma)',
    `1h: ${karmaHourPeak} | 24h: ${karmaDayPeak} | 7d: ${karmaWeekPeak} | 365d: ${karmaYearPeak}`,
  );

  // Averages
  const gammaHourAvg = gammaAvg(transcriptions, 60 * 60).toFixed(accuracy); // 1h
  const gammaDayAvg = gammaAvg(transcriptions, 24 * 60 * 60).toFixed(accuracy); // 24h
  const gammaWeekAvg = gammaAvg(transcriptions, 7 * 24 * 60 * 60).toFixed(accuracy); // 7d
  const gammaYearAvg = gammaAvg(transcriptions, 365 * 24 * 60 * 60).toFixed(accuracy); // 365d

  logStats(
    'Avgs (gamma)',
    `1h: ${gammaHourAvg} | 24h: ${gammaDayAvg} | 7d: ${gammaWeekAvg} | 365d: ${gammaYearAvg}`,
  );

  const karmaHourAvg = karmaAvg(transcriptions, 60 * 60).toFixed(accuracy); // 1h
  const karmaDayAvg = karmaAvg(transcriptions, 24 * 60 * 60).toFixed(accuracy); // 24h
  const karmaWeekAvg = karmaAvg(transcriptions, 7 * 24 * 60 * 60).toFixed(accuracy); // 7d
  const karmaYearAvg = karmaAvg(transcriptions, 365 * 24 * 60 * 60).toFixed(accuracy); // 365d

  logStats(
    'Avgs (karma)',
    `1h: ${karmaHourAvg} | 24h: ${karmaDayAvg} | 7d: ${karmaWeekAvg} | 365d: ${karmaYearAvg}`,
  );

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
  const typeGammaStats = limitEnd(typeGamma(transcriptions), 5).map((stats) => {
    return `${stats.type}: ${stats.count}`;
  });

  logStats('Top 5 types (gamma)', `${typeGammaStats.join(' | ')}`);

  const typeKarmaStats = limitEnd(typeKarma(transcriptions), 5).map((stats) => {
    return `${stats.type}: ${stats.karma}`;
  });

  logStats('Top 5 types (karma)', `${typeKarmaStats.join(' | ')}`);

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

  const modTag = [await getModTag(userName)].filter((tag) => tag !== null) as Tag[];
  const spTags = getSpecialTags(userName, transcriptions).concat(modTag);
  const spText = spTags.map((tag) => tag.name);

  const tagText = [countText].concat(spText).join(' | ');

  logStats('Tags', `${tagText}`);
}
