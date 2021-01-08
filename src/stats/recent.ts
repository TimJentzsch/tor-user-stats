import Transcription from '../transcription';

export type RecentStats = {
  score: number;
};

/**
 * Determines the recent score of the given transcriptions by the given value.
 * @param transcriptions The transcriptions to determine the recent score of.
 * @param duration The duration to determine the recent score in.
 * @param valuefn The value of a transcription.
 */
export function recentScoreBy(
  transcriptions: Transcription[],
  duration: number,
  valuefn: (transcription: Transcription) => number,
): RecentStats {
  let score = 0;
  let curIndex = 0;
  const start = Date.now();

  while (
    // While there are still transcriptions...
    curIndex < transcriptions.length &&
    // ...and they are in the given timeframe...
    start - transcriptions[curIndex].createdUTC <= duration
  ) {
    // ...increment the score...
    score += valuefn(transcriptions[curIndex]);
    // ...and update the index.
    curIndex += 1;
  }

  return {
    score,
  };
}

/**
 * Gets the peak transcription count during the given duration.
 * @param transcriptions The transcriptions to analyze.
 * @param duration The duration to determine the peak in, in seconds.
 */
export function recentGamma(transcriptions: Transcription[], duration: number): RecentStats {
  // Each transcription is worth 1 gamma
  return recentScoreBy(transcriptions, duration, () => 1);
}

/**
 * Gets the peak transcription count during the given duration.
 * @param transcriptions The transcriptions to analyze.
 * @param duration The duration to determine the peak in, in seconds.
 */
export function recentKarma(transcriptions: Transcription[], duration: number): RecentStats {
  return recentScoreBy(transcriptions, duration, (transcription) => transcription.score);
}
