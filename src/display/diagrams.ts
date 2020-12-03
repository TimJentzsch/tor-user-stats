import Plotly from 'plotly.js-dist';
import { analyzeFormat, analyzeSubreddits, analyzeType } from '../analizer';
import Transcription from '../transcription';
import { limitReduceEnd, repeat, repeatEndWith } from '../util';
import Colors from './colors';
import { fromTemplate } from './display-util';
import { layoutTemplate } from './templates';

export function displayFormatDiagram(transcriptions: Transcription[]): void {
  const formatStats = limitReduceEnd(
    analyzeFormat(transcriptions),
    (a, b) => {
      return {
        format: 'Other',
        count: a.count + b.count,
      };
    },
    5,
  );

  const data = [
    {
      values: formatStats.map((stats) => stats.count),
      labels: formatStats.map((stats) => stats.format),
      type: 'pie',
      textinfo: 'label+percent',
      textposition: 'outside',
      automargin: true,
      marker: {
        colors: repeat([Colors.primary(), Colors.primaryVariant()], formatStats.length),
      },
    },
  ];

  const layout = fromTemplate(layoutTemplate, {
    title: 'Top 5 Formats',
  });

  Plotly.newPlot('format-diagram', data, layout);
}

export function displayTypeDiagram(transcriptions: Transcription[]): void {
  const typeStats = limitReduceEnd(
    analyzeType(transcriptions),
    (a, b) => {
      return {
        type: 'Other',
        count: a.count + b.count,
      };
    },
    5,
  );

  const data = [
    {
      y: typeStats.map((stats) => stats.count),
      x: typeStats.map((stats) => stats.type),
      text: typeStats.map((stats) => stats.count.toString()),
      textposition: 'auto',
      type: 'bar',
      marker: {
        color: repeatEndWith(Colors.primary(), typeStats.length - 1, Colors.primaryVariant()),
      },
    },
  ];

  const layout = fromTemplate(layoutTemplate, {
    title: 'Top 5 Types',
    yaxis: {
      title: 'Transcription Count',
    },
  });

  Plotly.newPlot('type-diagram', data, layout);
}

export function displaySubredditDiagram(transcriptions: Transcription[]): void {
  const subStats = limitReduceEnd(
    analyzeSubreddits(transcriptions),
    (a, b) => {
      return {
        sub: 'Other',
        count: a.count + b.count,
      };
    },
    5,
  );

  const data = [
    {
      y: subStats.map((stats) => stats.count),
      x: subStats.map((stats) => stats.sub),
      text: subStats.map((stats) => stats.count.toString()),
      textposition: 'auto',
      type: 'bar',
      marker: {
        color: repeatEndWith(Colors.primary(), subStats.length - 1, Colors.primaryVariant()),
      },
    },
  ];

  const layout = fromTemplate(layoutTemplate, {
    title: 'Top 5 Subreddits',
    yaxis: {
      title: 'Transcription Count',
    },
  });

  Plotly.newPlot('subreddit-diagram', data, layout);
}
