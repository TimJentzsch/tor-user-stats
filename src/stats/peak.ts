import Transcription from '../transcription';

type PeakStats = {
  /** The peak of the transcriptions. */
  peak: number;
  /** The start of the peak. */
  startDate: Date;
  /** The end of the peak. */
  endDate: Date;
};

/**
 * Determines the peak of the given transcriptions by the given value.
 * @param transcriptions The transcriptions to determine the peak of.
 * @param duration The duration to determine the peak in, in seconds.
 * @param valuefn The value of a transcription.
 */
export function transcriptionPeakBy(
  transcriptions: Transcription[],
  duration: number,
  valuefn: (transcription: Transcription) => number,
): PeakStats {
  let peak = 0;
  let startDate = new Date();
  let endDate = new Date();

  if (transcriptions.length === 0) {
    return {
      peak,
      startDate,
      endDate,
    };
  }

  // Start with the oldest transcriptions
  let oldIndex = transcriptions.length - 1;
  let newIndex = transcriptions.length - 1;
  let cur = 0;

  while (newIndex >= 0) {
    // Take as many transcriptions as fit into the timeframe
    while (
      newIndex >= 0 &&
      transcriptions[newIndex].createdUTC - transcriptions[oldIndex].createdUTC <= duration
    ) {
      cur += valuefn(transcriptions[newIndex]);
      newIndex -= 1;
    }

    // Update the peak if necessary
    if (cur > peak) {
      peak = cur;
      startDate = new Date(transcriptions[oldIndex].createdUTC * 1000);
      endDate = new Date(transcriptions[newIndex + 1].createdUTC * 1000);
    }

    cur -= valuefn(transcriptions[oldIndex]);
    oldIndex -= 1;
  }

  return {
    peak,
    startDate,
    endDate,
  };
}

/**
 * Gets the peak transcription count during the given duration.
 * @param transcriptions The transcriptions to analyze.
 * @param duration The duration to determine the peak in, in seconds.
 */
export function gammaPeak(transcriptions: Transcription[], duration: number): PeakStats {
  // Each transcription is worth 1 gamma
  return transcriptionPeakBy(transcriptions, duration, () => 1);
}

/**
 * Gets the peak transcription count during the given duration.
 * @param transcriptions The transcriptions to analyze.
 * @param duration The duration to determine the peak in, in seconds.
 */
export function karmaPeak(transcriptions: Transcription[], duration: number): PeakStats {
  return transcriptionPeakBy(transcriptions, duration, (transcription) => transcription.score);
}
