import Transcription from '../transcription';

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
// eslint-disable-next-line import/prefer-default-export
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
