import Transcription from '../transcription';

type SubGammaStats = {
  /** The name of the subreddit. */
  sub: string;
  /** The number of transcriptions for the subreddit. */
  count: number;
};

/**
 * Analyzes the transcription gamma by subreddit.
 * @param transcriptions The transcriptions to analyze.
 */
// eslint-disable-next-line import/prefer-default-export
export function subredditGamma(transcriptions: Transcription[]): SubGammaStats[] {
  const subStats: SubGammaStats[] = [];

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

type SubKarmaStats = {
  /** The name of the subreddit. */
  sub: string;
  /** The karma of transcriptions for the subreddit. */
  karma: number;
};

/**
 * Analyzes the transcription karma by subreddit.
 * @param transcriptions The transcriptions to analyze.
 */
export function subredditKarma(transcriptions: Transcription[]): SubKarmaStats[] {
  const subStats: SubKarmaStats[] = [];

  transcriptions.forEach((transcription) => {
    const sub = transcription.subredditNamePrefixed;

    const stats = subStats.find((stat) => {
      return stat.sub === sub;
    });

    if (stats) {
      stats.karma += transcription.score;
    } else {
      subStats.push({
        sub,
        karma: transcription.score,
      });
    }
  });

  // Sort by karma descending
  return subStats.sort((a, b) => {
    return b.karma - a.karma;
  });
}
