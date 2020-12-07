import Transcription from '../transcription';
import { gammaPeak, karmaPeak, PeakStats } from './peak';

export type RateStats = {
  /** The date of the data. */
  date: Date;
  /** The rate at the date. */
  rate: number;
};

/**
 * Determines the rate of the transcriptions.
 * @param transcriptions The transcriptions to determine the rate of.
 * @param duration The duration of the timeframe.
 * @param valuefn The value of each transcription.
 * @param peakfn The peak of the transcriptions.
 */
export function transcriptionRateBy(
  transcriptions: Transcription[],
  duration: number,
  valuefn: (transcription: Transcription) => number,
  peakfn: (transcriptions: Transcription[], duration: number) => PeakStats,
): RateStats[] {
  const data: RateStats[] = [];

  if (transcriptions.length === 0) {
    return data;
  }

  // The peak should be included in the rate diagram
  const peak = peakfn(transcriptions, duration) as {
    peak: number;
    first: Transcription;
    last: Transcription;
    startDate: Date;
    endDate: Date;
  };

  const start = transcriptions[transcriptions.length - 1].createdUTC;
  const end = transcriptions[0].createdUTC;
  let rateStart = peak.startDate.valueOf() / 1000;

  // Determine rate start
  while (rateStart > start) {
    rateStart -= duration;
  }

  let curDate = rateStart;
  let curRate = 0;
  let curIndex = transcriptions.length - 1;

  while (curIndex >= 0 && curDate <= end) {
    // Add all transcriptions in that timeframe to the rate
    while (curIndex >= 0 && transcriptions[curIndex].createdUTC <= curDate + duration) {
      curRate += valuefn(transcriptions[curIndex]);
      curIndex -= 1;
    }
    // The center of the timeframe
    const date = new Date((curDate + duration / 2) * 1000);
    // Save the timeframe
    data.push({
      rate: curRate,
      date,
    });
    // Move to the next timeframe
    curRate = 0;
    curDate += duration;
  }

  return data;
}

/**
 * Determines the gamma rate of the transcriptions.
 * @param transcriptions The transcriptions to determine the gamma rate of.
 * @param duration The duration of the timeframe.
 */
export function gammaRate(transcriptions: Transcription[], duration: number): RateStats[] {
  // Each transcription is worth 1 gamma
  return transcriptionRateBy(transcriptions, duration, () => 1, gammaPeak);
}

/**
 * Determines the karma rate of the transcriptions.
 * @param transcriptions The transcriptions to determine the karma rate of.
 * @param duration The duration of the timeframe.
 */
export function karmaRate(transcriptions: Transcription[], duration: number): RateStats[] {
  return transcriptionRateBy(
    transcriptions,
    duration,
    (transcription) => transcription.score,
    karmaPeak,
  );
}
