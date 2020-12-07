import { heatmap } from '../stats/heatmap';
import Transcription from '../transcription';
import { updateElement } from './display-util';

/** The number of heatmap levels */
const HEATMAP_LEVELS = 3;

function getTableHeader(): HTMLTableRowElement {
  const row = document.createElement('tr');

  // One empty element in the 'corner'
  row.appendChild(document.createElement('th'));

  // Add an element for every hour
  for (let i = 0; i < 24; i += 1) {
    const th = document.createElement('th');
    th.innerText = i.toString().padStart(2, '0');
    row.appendChild(th);
  }

  return row;
}

function getTableRow(day: string, dID: number): HTMLTableRowElement {
  const row = document.createElement('tr');

  // The day heading
  const dayTh = document.createElement('th');
  dayTh.classList.add('right-th');
  dayTh.innerText = day;
  row.appendChild(dayTh);

  // Add an element for every hour
  for (let h = 0; h < 24; h += 1) {
    const td = document.createElement('td');
    td.id = `heatmap-d${dID}-h${h}`;
    row.appendChild(td);
  }

  return row;
}

// eslint-disable-next-line import/prefer-default-export
export function initHeatmapTable(): void {
  const table = document.getElementById('heatmap') as HTMLTableElement;
  table.appendChild(getTableHeader());

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  days.forEach((day, dID) => {
    table.appendChild(getTableRow(day, dID));
  });
}

export function displayHeatmap(transcriptions: Transcription[]): void {
  const data = heatmap(transcriptions);

  for (let d = 0; d < 7; d += 1) {
    for (let h = 0; h < 24; h += 1) {
      const entries = data[d][h].entries !== 0 ? data[d][h].entries.toString() : '';
      const level = Math.ceil(data[d][h].heat * HEATMAP_LEVELS);

      // Wrap the index around, so that Monday is 0 and Sunday is 6
      let dID = d + 1;
      if (dID >= 7) {
        dID -= 7;
      }
      const id = `heatmap-d${dID}-h${h}`;
      updateElement(id, entries);

      const td = document.getElementById(id);

      for (let i = 0; i <= HEATMAP_LEVELS; i += 1) {
        td?.classList.remove(`heatmap-${i}`);
      }

      td?.classList.add(`heatmap-${level}`);
    }
  }
}
