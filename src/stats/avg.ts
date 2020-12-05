import Transcription from '../transcription';

/**
 * Gets the average number of transcriptions made in the given timeframe.
 * @param transcriptions The transcriptions to analyze.
 * @param duration The duration to get the average for, in seconds.
 */
export function gammaAvg(transcriptions: Transcription[], duration: number): number {
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
 * Gets the average number of transcriptions made in the given timeframe.
 * @param transcriptions The transcriptions to analyze.
 * @param duration The duration to get the average for, in seconds.
 */
export function karmaAvg(transcriptions: Transcription[], duration: number): number {
  // Check if transcriptions have been made
  if (transcriptions.length === 0) {
    return 0;
  }

  const totalKarma = transcriptions
    .map((transcription) => transcription.score)
    .reduce((sum, cur) => {
      return sum + cur;
    });

  const transcriptionStart = transcriptions[transcriptions.length - 1].createdUTC;
  const transcriptionEnd = transcriptions[0].createdUTC;
  const transcriptionDur = transcriptionEnd - transcriptionStart;

  // If the timeframe is larger than the transcription frame, return the number of transcriptions
  if (transcriptionDur <= duration) {
    return totalKarma;
  }

  // Return the avg count of transcriptions in the given timeframe
  return (duration / transcriptionDur) * totalKarma;
}
