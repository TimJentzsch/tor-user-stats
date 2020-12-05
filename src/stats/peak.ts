import Transcription from '../transcription';

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
// eslint-disable-next-line import/prefer-default-export
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
