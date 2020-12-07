import Transcription from '../transcription';

export type NullPeak = {
  /** The peak of the transcriptions. */
  peak: 0;
};

export type Peak = {
  /** The peak of the transcriptions. */
  peak: number;
  /** The first transcription in the peak timeframe. */
  first: Transcription;
  /** The last transcription in the peak timeframe. */
  last: Transcription;
  /** The start of the peak timeframe. */
  startDate: Date;
  /** The end of the peak timeframe. */
  endDate: Date;
};

export type PeakStats = NullPeak | Peak;

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
  // TODO: Figure out a better way to initialize this
  let first;
  let last;

  if (transcriptions.length === 0) {
    return {
      peak: 0,
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

      first = transcriptions[oldIndex];
      last = transcriptions[newIndex + 1];

      // Center the peak in the given timeframe
      const offset = (duration - (last.createdUTC - first.createdUTC)) / 2;

      startDate = new Date((first.createdUTC - offset) * 1000);
      endDate = new Date((first.createdUTC - offset + duration) * 1000);
    }

    cur -= valuefn(transcriptions[oldIndex]);
    oldIndex -= 1;
  }

  return {
    peak,
    first: first as Transcription,
    last: last as Transcription,
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
