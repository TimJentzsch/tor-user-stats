import Transcription from '../transcription';

type HistoryData = {
  /** The date of the data. */
  date: Date;
  /** The number of transcriptions at the date. */
  count: number;
};

// eslint-disable-next-line import/prefer-default-export
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
