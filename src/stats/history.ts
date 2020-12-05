import Transcription from '../transcription';

type HistoryGammaData = {
  /** The date of the data. */
  date: Date;
  /** The number of transcriptions at the date. */
  count: number;
};

export function gammaHistory(transcriptions: Transcription[]): HistoryGammaData[] {
  const data: HistoryGammaData[] = [];
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

type HistoryKarmaData = {
  /** The date of the data. */
  date: Date;
  /** The transcription karma at the date. */
  karma: number;
};

export function karmaHistory(transcriptions: Transcription[]): HistoryKarmaData[] {
  const data: HistoryKarmaData[] = [];
  let karma = 0;

  for (let i = transcriptions.length - 1; i >= 0; i -= 1) {
    karma += transcriptions[i].score;

    data.push({
      date: new Date(transcriptions[i].createdUTC * 1000),
      karma,
    });
  }

  return data;
}
