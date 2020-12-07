import Transcription from '../transcription';

export type HeatMapDay = Record<number, number>;

export type HeatMap = Record<number, HeatMapDay>;

/** Initializes the heatmap with 0 entries. */
function initHeatmap(): HeatMap {
  const heatMap: HeatMap = {};

  // For every day...
  for (let d = 0; d <= 7; d += 1) {
    const dayMap: HeatMapDay = {};

    // And every hour of the day...
    for (let h = 0; h <= 23; h += 1) {
      // Generate a '0' entry
      dayMap[h] = 0;
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

  transcriptions.forEach((transcription) => {
    const date = new Date(transcription.createdUTC * 1000);
    const day = date.getUTCDay();
    const hour = date.getUTCHours();

    // Increase the corresponding heat map entry
    heatMap[day][hour] += 1;
  });

  return heatMap;
}
