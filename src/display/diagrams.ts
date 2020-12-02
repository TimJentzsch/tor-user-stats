import Plotly from 'plotly.js-dist';
import { analyzeFormat, analyzeType } from '../analizer';
import Transcription from '../transcription';
import { limitStart } from '../util';
import Colors from './colors';
import { fromTemplate } from './display-util';
import { layoutTemplate } from './templates';

export function displayFormatDiagram(transcriptions: Transcription[]): void {
  const formatStats = limitStart(analyzeFormat(transcriptions), 5);

  const data = [
    {
      values: formatStats.map((stats) => stats.count),
      labels: formatStats.map((stats) => stats.format),
      type: 'pie',
      textinfo: 'label+percent',
      textposition: 'outside',
      automargin: true,
      marker: {
        colors: [Colors.primary(), Colors.primaryVariant()],
      },
    },
  ];

  const layout = fromTemplate(layoutTemplate, {
    title: 'Top 5 Formats',
  });

  Plotly.newPlot('format-diagram', data, layout);
}

export function displayTypeDiagram(transcriptions: Transcription[]): void {
  const typeStats = limitStart(analyzeType(transcriptions), 5);

  const data = [
    {
      y: typeStats.map((stats) => stats.count),
      x: typeStats.map((stats) => stats.type),
      text: typeStats.map((stats) => stats.count.toString()),
      textposition: 'auto',
      type: 'bar',
      marker: {
        color: Colors.primary(),
      },
    },
  ];

  const layout = fromTemplate(layoutTemplate, {
    title: 'Top 5 Types',
  });

  Plotly.newPlot('type-diagram', data, layout);
}
