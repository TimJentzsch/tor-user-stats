import Plotly from 'plotly.js-dist';
import { Comment } from 'snoowrap';
import Durations from '../durations';
import { gammaHistory, karmaHistory } from '../stats/history';
import { gammaPeak } from '../stats/peak';
import { gammaRate, karmaRate } from '../stats/rate';
import { subredditGamma, subredditKarma } from '../stats/subreddits';
import { formatGamma, formatKarma, typeGamma, typeKarma } from '../stats/type';
import { countTagList } from '../tags';
import Transcription from '../transcription';
import { limitReduceEnd, repeat, repeatEndWith } from '../util';
import Colors from './colors';
import { fromTemplate, getGamma, getVariable } from './display-util';
import { layoutTemplate } from './templates';

export function formatGammaDiagram(transcriptions: Transcription[]): void {
  const formatStats = limitReduceEnd(
    formatGamma(transcriptions),
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
        colors: repeat(Colors.heatmap().reverse(), formatStats.length),
      },
    },
  ];

  const layout = fromTemplate(layoutTemplate, {
    title: 'Top 5 Formats (Gamma)',
  });

  Plotly.newPlot('format-gamma-diagram', data, layout);
}

export function typeGammaDiagram(transcriptions: Transcription[]): void {
  const typeStats = limitReduceEnd(
    typeGamma(transcriptions),
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
    title: 'Top 5 Types (Gamma)',
    yaxis: {
      title: 'Gamma',
      gridcolor: Colors.grid(),
    },
    xaxis: {
      type: 'category',
    },
  });

  Plotly.newPlot('type-gamma-diagram', data, layout);
}

export function formatKarmaDiagram(transcriptions: Transcription[]): void {
  const formatStats = limitReduceEnd(
    formatKarma(transcriptions),
    (a, b) => {
      return {
        format: 'Other',
        karma: a.karma + b.karma,
      };
    },
    5,
  );

  const data = [
    {
      values: formatStats.map((stats) => stats.karma),
      labels: formatStats.map((stats) => stats.format),
      type: 'pie',
      textinfo: 'label+percent',
      textposition: 'outside',
      automargin: true,
      marker: {
        colors: repeat(Colors.heatmap().reverse(), formatStats.length),
      },
    },
  ];

  const layout = fromTemplate(layoutTemplate, {
    title: 'Top 5 Formats (Karma)',
  });

  Plotly.newPlot('format-karma-diagram', data, layout);
}

export function typeKarmaDiagram(transcriptions: Transcription[]): void {
  const typeStats = limitReduceEnd(
    typeKarma(transcriptions),
    (a, b) => {
      return {
        type: 'Other',
        karma: a.karma + b.karma,
      };
    },
    5,
  );

  const data = [
    {
      y: typeStats.map((stats) => stats.karma),
      x: typeStats.map((stats) => stats.type),
      text: typeStats.map((stats) => stats.karma.toString()),
      textposition: 'auto',
      type: 'bar',
      marker: {
        color: repeatEndWith(Colors.primary(), typeStats.length - 1, Colors.primaryVariant()),
      },
      hoverinfo: 'none',
    },
  ];

  const layout = fromTemplate(layoutTemplate, {
    title: 'Top 5 Types (Karma)',
    yaxis: {
      title: 'Karma',
      gridcolor: Colors.grid(),
    },
    xaxis: {
      type: 'category',
    },
  });

  Plotly.newPlot('type-karma-diagram', data, layout);
}

export function displaySubGammaDiagram(transcriptions: Transcription[]): void {
  const subStats = limitReduceEnd(
    subredditGamma(transcriptions),
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
    title: 'Top 5 Subreddits (Gamma)',
    yaxis: {
      title: 'Gamma',
      gridcolor: Colors.grid(),
    },
    xaxis: {
      type: 'category',
    },
  });

  Plotly.newPlot('sub-gamma-diagram', data, layout);
}

export function displaySubKarmaDiagram(transcriptions: Transcription[]): void {
  const subStats = limitReduceEnd(
    subredditKarma(transcriptions),
    (a, b) => {
      return {
        sub: 'Other',
        karma: a.karma + b.karma,
      };
    },
    5,
  );

  const data = [
    {
      y: subStats.map((stats) => stats.karma),
      x: subStats.map((stats) => stats.sub),
      text: subStats.map((stats) => stats.karma.toString()),
      textposition: 'auto',
      type: 'bar',
      marker: {
        color: repeatEndWith(Colors.primary(), subStats.length - 1, Colors.primaryVariant()),
      },
      hoverinfo: 'none',
    },
  ];

  const layout = fromTemplate(layoutTemplate, {
    title: 'Top 5 Subreddits (Karma)',
    yaxis: {
      title: 'Karma',
      gridcolor: Colors.grid(),
    },
    xaxis: {
      type: 'category',
    },
  });

  Plotly.newPlot('sub-karma-diagram', data, layout);
}

export function gammaHistoryDiagram(
  transcriptions: Transcription[],
  refComment: Comment | undefined,
): void {
  let history = gammaHistory(transcriptions);

  const gamma = getGamma(transcriptions, refComment);
  const gammaDif = gamma - transcriptions.length;

  // Normalize gamma to get up-to-date values
  history = history.map((hItem) => {
    return {
      count: hItem.count + gammaDif,
      date: hItem.date,
    };
  });

  // Add an up-to date last entry
  history.push({
    count: gamma,
    date: new Date(),
  });

  const data = [];

  if (transcriptions.length > 0) {
    const start = history[0].date.valueOf();
    const end = history[history.length - 1].date.valueOf();
    const max = history[history.length - 1].count;

    // Add milestone lines
    countTagList.forEach((tag) => {
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
    title: 'History (Gamma)',
    yaxis: {
      title: 'Gamma',
      gridcolor: Colors.grid(),
    },
    xaxis: {
      type: 'date',
      gridcolor: Colors.grid(),
    },
  });

  Plotly.newPlot('gamma-history-diagram', data, layout);
}

export function gammaRateDiagram(transcriptions: Transcription[]): void {
  const rate = gammaRate(transcriptions, Durations.day); // 24h

  // Add an up-to date last entry
  if (rate.length > 0) {
    const last = rate[rate.length - 1];
    const lastDate = last.date.valueOf();
    const nextDay = new Date(lastDate + Durations.day * 1000);
    const today = new Date(
      lastDate +
        Math.floor((Date.now() - lastDate) / (Durations.day * 1000)) * Durations.day * 1000,
    );

    if (nextDay.valueOf() < Date.now()) {
      rate.push({
        rate: 0,
        date: nextDay,
      });
      if (today.valueOf() > nextDay.valueOf()) {
        rate.push({
          rate: 0,
          date: today,
        });
      }
    }
  }

  const data = [];

  if (transcriptions.length > 0) {
    const start = rate[0].date.valueOf();
    const end = rate[rate.length - 1].date.valueOf();
    const max = gammaPeak(transcriptions, Durations.day).peak; // 24h

    // Display 100/24h line if close
    if (max >= 75) {
      data.push({
        y: [100, 100],
        x: [start, end],
        type: 'scatter',
        marker: {
          color: getVariable('twenty-four'),
        },
        mode: 'lines',
      });
    }
  }

  data.push({
    y: rate.map((stats) => stats.rate),
    x: rate.map((stats) => stats.date.valueOf()),
    type: 'scatter',
    marker: {
      color: Colors.primary(),
    },
  });

  const layout = fromTemplate(layoutTemplate, {
    title: 'Rate (Gamma, 24 h)',
    yaxis: {
      title: 'Gamma Rate',
      gridcolor: Colors.grid(),
    },
    xaxis: {
      type: 'date',
      gridcolor: Colors.grid(),
    },
  });

  Plotly.newPlot('gamma-rate-diagram', data, layout);
}

export function karmaHistoryDiagram(transcriptions: Transcription[]): void {
  const history = karmaHistory(transcriptions);

  // Add an up-to date last entry
  if (history.length > 0) {
    history.push({
      karma: history[history.length - 1].karma,
      date: new Date(),
    });
  }

  const data = [
    {
      y: history.map((stats) => stats.karma),
      x: history.map((stats) => stats.date.valueOf()),
      type: 'scatter',
      marker: {
        color: Colors.primary(),
      },
    },
  ];

  const layout = fromTemplate(layoutTemplate, {
    title: 'History (Karma)',
    yaxis: {
      title: 'Karma',
      gridcolor: Colors.grid(),
    },
    xaxis: {
      type: 'date',
      gridcolor: Colors.grid(),
    },
  });

  Plotly.newPlot('karma-history-diagram', data, layout);
}

export function karmaRateDiagram(transcriptions: Transcription[]): void {
  const rate = karmaRate(transcriptions, Durations.day); // 24h

  // Add an up-to date last entry
  if (rate.length > 0) {
    const last = rate[rate.length - 1];
    const lastDate = last.date.valueOf();
    const nextDay = new Date(lastDate + Durations.day * 1000);
    const today = new Date(
      lastDate +
        Math.floor((Date.now() - lastDate) / (Durations.day * 1000)) * Durations.day * 1000,
    );

    if (nextDay.valueOf() < Date.now()) {
      rate.push({
        rate: 0,
        date: nextDay,
      });
      if (today.valueOf() > nextDay.valueOf()) {
        rate.push({
          rate: 0,
          date: today,
        });
      }
    }
  }

  const data = [
    {
      y: rate.map((stats) => stats.rate),
      x: rate.map((stats) => stats.date.valueOf()),
      type: 'scatter',
      marker: {
        color: Colors.primary(),
      },
    },
  ];

  const layout = fromTemplate(layoutTemplate, {
    title: 'Rate (Karma, 24 h)',
    yaxis: {
      title: 'Karma Rate',
      gridcolor: Colors.grid(),
    },
    xaxis: {
      type: 'date',
      gridcolor: Colors.grid(),
    },
  });

  Plotly.newPlot('karma-rate-diagram', data, layout);
}
