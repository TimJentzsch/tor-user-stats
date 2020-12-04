import { getTranscriptionPeak } from '../analizer';
import Transcription from '../transcription';

type HistoryData = {
  /** The date of the data. */
  date: Date;
  /** The number of transcriptions at the date. */
  count: number;
};

export function historyData(transcriptions: Transcription[]): HistoryData[] {
  const data: HistoryData[] = [];
  let count = 0;

  for (let i = transcriptions.length - 1; i >= 0; i -= 1) {
    count += 1;

    data.push({
      date: new Date(transcriptions[i].createdUTC * 1000),
      count,
    });
  }

  return data;
}

type RateData = {
  /** The date of the data. */
  date: Date;
  /** The rate at the date. */
  rate: number;
};

export function rateData(transcriptions: Transcription[], duration: number): RateData[] {
  const data: RateData[] = [];

  if (transcriptions.length === 0) {
    return data;
  }

  // The peak should be included in the rate diagram
  const peak = getTranscriptionPeak(transcriptions, duration);

  const start = transcriptions[transcriptions.length - 1].createdUTC;
  let rateStart = peak.startDate.valueOf() / 1000;

  // Determine rate start
  while (rateStart > start) {
    rateStart -= duration;
  }

  let nextRate = rateStart + duration;
  let rate = 0;

  // Determine the rate data
  for (let i = transcriptions.length - 1; i >= 0; i -= 1) {
    // If the transcription belongs to the current rate, add it
    if (transcriptions[i].createdUTC <= nextRate) {
      rate += 1;
    } else {
      data.push({
        date: new Date((nextRate - duration) * 1000),
        rate,
      });

      // Reset counters
      rate = 0;
      nextRate += duration;
    }
  }

  return data;
}
