import Plotly from 'plotly.js-dist';
import { analyzeFormat, analyzeSubreddits, analyzeType } from '../analizer';
import { historyData, rateData } from '../stats/history';
import { countTags } from '../tags';
import Transcription from '../transcription';
import { limitReduceEnd, repeat, repeatEndWith } from '../util';
import Colors from './colors';
import { fromTemplate, getVariable } from './display-util';
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
      hoverinfo: 'none',
    },
  ];

  const layout = fromTemplate(layoutTemplate, {
    title: 'Top 5 Types',
    yaxis: {
      title: 'Transcription Count',
    },
    xaxis: {
      type: 'category',
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
      hoverinfo: 'none',
    },
  ];

  const layout = fromTemplate(layoutTemplate, {
    title: 'Top 5 Subreddits',
    yaxis: {
      title: 'Transcription Count',
    },
    xaxis: {
      type: 'category',
    },
  });

  Plotly.newPlot('subreddit-diagram', data, layout);
}

export function displayHistoryDiagram(transcriptions: Transcription[]): void {
  const history = historyData(transcriptions);

  const data = [];

  if (transcriptions.length > 0) {
    const start = history[0].date.valueOf();
    const end = history[history.length - 1].date.valueOf();
    const max = history[history.length - 1].count;

    // Add milestone lines
    countTags.forEach((tag) => {
      if (tag.lowerBound <= max * 1.2) {
        data.push({
          y: [tag.lowerBound, tag.lowerBound],
          x: [start, end],
          type: 'scatter',
          marker: {
            color: getVariable(tag.id),
          },
          mode: 'lines',
        });
      }
    });
  }

  // Add actual history graph
  data.push({
    y: history.map((stats) => stats.count),
    x: history.map((stats) => stats.date.valueOf()),
    type: 'scatter',
    marker: {
      color: Colors.primary(),
    },
  });

  const layout = fromTemplate(layoutTemplate, {
    title: 'History',
    yaxis: {
      title: 'Transcription Count',
    },
    xaxis: {
      type: 'date',
    },
  });

  Plotly.newPlot('history-diagram', data, layout);
}

export function displayRateDiagram(transcriptions: Transcription[]): void {
  const history = rateData(transcriptions, 24 * 60 * 60); // 24h

  const data = [
    {
      y: history.map((stats) => stats.rate),
      x: history.map((stats) => stats.date.valueOf()),
      type: 'scatter',
      marker: {
        color: Colors.primary(),
      },
    },
  ];

  const layout = fromTemplate(layoutTemplate, {
    title: 'Rate (24 h)',
    yaxis: {
      title: 'Transcription Rate',
    },
    xaxis: {
      type: 'date',
    },
  });

  Plotly.newPlot('rate-diagram', data, layout);
}
