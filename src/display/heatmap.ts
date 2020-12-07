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

function getTableRow(day: string, index: number): HTMLTableRowElement {
  const row = document.createElement('tr');

  // The day heading
  const dayTh = document.createElement('th');
  dayTh.classList.add('right-th');
  dayTh.innerText = day;
  row.appendChild(dayTh);

  // Add an element for every hour
  for (let h = 0; h < 24; h += 1) {
    // Wrap the index around, so that Monday is 0 and Sunday is 6
    let dayId = index + 1;
    if (dayId >= 7) {
      dayId -= 7;
    }

    const td = document.createElement('td');
    td.id = `heatmap-d${dayId}-h${h}`;
    row.appendChild(td);
  }

  return row;
}

// eslint-disable-next-line import/prefer-default-export
export function initHeatmapTable(): void {
  const table = document.getElementById('heatmap') as HTMLTableElement;
  table.appendChild(getTableHeader());

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  days.forEach((day, index) => {
    table.appendChild(getTableRow(day, index));
  });
}
