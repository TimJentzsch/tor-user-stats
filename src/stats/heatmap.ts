import Transcription from '../transcription';

export type HeatMapDay = Record<
  number,
  {
    /** The number of entries in this timeslot. */
    entries: number;
    /** The 'heat' of this timeslot, a number from 0 to 1. */
    heat: number;
  }
>;

export type HeatMap = Record<number, HeatMapDay>;

/** Initializes the heatmap with 0 entries. */
export function initHeatmap(): HeatMap {
  const heatMap: HeatMap = {};

  // For every day...
  for (let d = 0; d < 7; d += 1) {
    const dayMap: HeatMapDay = {};

    // And every hour of the day...
    for (let h = 0; h < 24; h += 1) {
      // Generate a '0' entry
      dayMap[h] = {
        entries: 0,
        heat: 0,
      };
    }

    heatMap[d] = dayMap;
  }

  return heatMap;
}

/**
 * Gets a heatmap for the given transcriptions.
 * @param transcriptions The transcriptions to get the heatmap for.
 */
export function heatmap(transcriptions: Transcription[]): HeatMap {
  const heatMap = initHeatmap();

  let peak = 0;

  // Count entries
  transcriptions.forEach((transcription) => {
    const date = new Date(transcription.createdUTC * 1000);
    // Wrap day around so that Monday is 0 and Sunday is 7
    let day = date.getUTCDay() - 1;
    if (day < 0) {
      day += 7;
    }
    const hour = date.getUTCHours();

    // Increase the corresponding heat map entry
    heatMap[day][hour].entries += 1;

    // Update peak if necessary
    if (heatMap[day][hour].entries > peak) {
      peak = heatMap[day][hour].entries;
    }
  });

  if (peak !== 0) {
    // For every day...
    for (let d = 0; d < 7; d += 1) {
      // And every hour of the day...
      for (let h = 0; h < 24; h += 1) {
        // Update heat
        heatMap[d][h].heat = heatMap[d][h].entries / peak;
      }
    }
  }

  return heatMap;
}
