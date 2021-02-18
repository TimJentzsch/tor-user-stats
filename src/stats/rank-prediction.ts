import { CountTag, countTagList } from '../tags';
import Transcription from '../transcription';
import { recentGamma } from './recent';
import { getCountTag } from './tags';

export type GammaPrediction = {
  /** The targeted gamma. */
  target: number;
  /** The transcription rate. */
  rate: number;
  /** The duration until the next rank is reached. */
  duration: number;
} | null;

/**
 * Predicts how long the user will need to reach the target gamma.
 * @param transcriptions The transcriptions of the user.
 * @param duration The duration to base the transcription rate on.
 * @param target The targeted gamma.
 */
export function predictUntilGamma(
  totalGamma: number,
  transcriptions: Transcription[],
  duration: number,
  target: number,
): GammaPrediction {
  const rate = recentGamma(transcriptions, duration).score;

  const gammaToTarget = target - totalGamma;
  const toTargetDuration = (gammaToTarget / rate) * duration;

  return {
    target,
    rate,
    duration: toTargetDuration,
  };
}

export type RankPrediction = {
  /** The targeted rank. */
  rank: CountTag;
  /** The transcription rate. */
  rate: number;
  /** The duration until the next rank is reached. */
  duration: number;
} | null;

/**
 * Predicts how long the user will need to reach the target rank.
 * @param transcriptions The transcriptions to analyze.
 * @param duration The duration to base the transcription rate on.
 * @param rank The targeted rank.
 */
export function predictUntilRank(
  totalGamma: number,
  transcriptions: Transcription[],
  duration: number,
  rank: CountTag,
): RankPrediction {
  const prediction = predictUntilGamma(totalGamma, transcriptions, duration, rank.lowerBound);

  if (!prediction) {
    return null;
  }

  return {
    rank,
    rate: prediction.rate,
    duration: prediction.duration,
  };
}

/**
 * Predicts how long the user will need to reach the next rank.
 * @param transcriptions The transcriptions to analyze.
 * @param duration The duration to base the transcription rate on.
 */
export function predictUntilNextRank(
  totalGamma: number,
  transcriptions: Transcription[],
  duration: number,
): RankPrediction {
  const curRank = getCountTag(totalGamma);
  const curRankIndex = countTagList.findIndex((countTag) => {
    return countTag.id === curRank.id;
  });

  if (curRankIndex === countTagList.length - 1) {
    // The user already reached the highest rank
    return null;
  }

  const nextRank = countTagList[curRankIndex + 1];

  return predictUntilRank(totalGamma, transcriptions, duration, nextRank);
}
