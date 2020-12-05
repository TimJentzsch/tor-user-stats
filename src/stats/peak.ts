import Transcription from '../transcription';

type PeakCountStats = {
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
export function gammaPeak(transcriptions: Transcription[], duration: number): PeakCountStats {
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

type PeakKarmaStats = {
  /** The karma of transcriptions at the peak. */
  karma: number;
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
export function karmaPeak(transcriptions: Transcription[], duration: number): PeakKarmaStats {
  let peak = 0;
  let startDate = new Date();
  let endDate = new Date();

  if (transcriptions.length === 0) {
    return {
      karma: peak,
      startDate,
      endDate,
    };
  }

  // Start with the oldest transcriptions
  let oldIndex = transcriptions.length - 1;
  let newIndex = transcriptions.length - 1;
  let karma = 0;

  while (newIndex >= 0) {
    // Take as many transcriptions as fit into the timeframe
    while (
      newIndex >= 0 &&
      transcriptions[newIndex].createdUTC - transcriptions[oldIndex].createdUTC <= duration
    ) {
      karma += transcriptions[newIndex].score;
      newIndex -= 1;
    }

    // Update the peak if necessary
    if (karma > peak) {
      peak = karma;
      startDate = new Date(transcriptions[oldIndex].createdUTC * 1000);
      endDate = new Date(transcriptions[newIndex + 1].createdUTC * 1000);
    }

    karma -= transcriptions[oldIndex].score;
    oldIndex -= 1;
  }

  return {
    karma: peak,
    startDate,
    endDate,
  };
}
