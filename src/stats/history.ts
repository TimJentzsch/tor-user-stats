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
      curRate += 1;
      curIndex -= 1;
    }
    // Save the timeframe
    data.push({
      rate: curRate,
      date: new Date(curDate * 1000),
    });
    // Move to the next timeframe
    curRate = 0;
    curDate += duration;
  }

  return data;
}