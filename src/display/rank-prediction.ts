import Plotly from 'plotly.js-dist';
import { Comment } from 'snoowrap';
import Durations from '../durations';
import { gammaHistory } from '../stats/history';
import { predictUntilNextRank } from '../stats/rank-prediction';
import { countTagList } from '../tags';
import Transcription from '../transcription';
import Colors from './colors';
import { fromTemplate, getGamma, getVariable } from './display-util';
import { layoutTemplate } from './templates';

function getShortDurationStr(duration: number): string {
  const sec = Math.floor(duration);

  // Calculate readable duration
  const years = sec / Durations.year;
  const days = sec / Durations.day;
  const hours = sec / Durations.hour;
  const minutes = sec / Durations.minute;
  const seconds = sec / Durations.minute;

  if (Math.floor(years) > 0) {
    return `${years.toFixed(1)}y`;
  }
  if (Math.floor(days) > 0) {
    return `${days.toFixed(1)}d`;
  }
  if (Math.floor(hours) > 0) {
    return `${hours.toFixed(1)}h`;
  }
  if (Math.floor(minutes) > 0) {
    return `${minutes.toFixed(1)}m`;
  }

  return `${seconds.toFixed(1)}s`;
}

function getLongDurationStr(duration: number): string {
  const sec = Math.floor(duration);

  // Calculate readable duration
  const years = sec / Durations.year;
  const days = sec / Durations.day;
  const hours = sec / Durations.hour;
  const minutes = sec / Durations.minute;
  const seconds = sec / Durations.minute;

  if (Math.floor(years) > 0) {
    return `${years.toFixed(1)} year(s)`;
  }
  if (Math.floor(days) > 0) {
    return `${days.toFixed(1)} day(s)`;
  }
  if (Math.floor(hours) > 0) {
    return `${hours.toFixed(1)} hour(s)`;
  }
  if (Math.floor(minutes) > 0) {
    return `${minutes.toFixed(1)} minute(s)`;
  }

  return `${seconds.toFixed(1)} second(s)`;
}

export function displayNextRankPrediction(
  transcriptions: Transcription[],
  duration: number,
  durationStr: string,
  refComment?: Comment,
): void {
  const totalGamma = getGamma(transcriptions, refComment);
  const prediction = predictUntilNextRank(totalGamma, transcriptions, duration);

  const descriptionElement = document.getElementById(
    `prediction-${durationStr}-description`,
  ) as HTMLDivElement;

  if (!prediction) {
    descriptionElement.innerText = `The highest rank has already been reached!`;
  } else if (prediction.duration === Infinity) {
    descriptionElement.innerText = `At a rate of ${prediction.rate}/${durationStr}, ${prediction.rank.name} will never be reached!`;
  } else {
    const formattedDuration = getLongDurationStr(prediction.duration);
    let rateStr = prediction.rate.toString();
    let extraStr = '';

    if (prediction.extrapolated) {
      const extraDuration = getShortDurationStr(prediction.extrapolated.duration);
      const extraRate = prediction.extrapolated.rate;
      rateStr = prediction.rate.toFixed(2);
      extraStr = ` (from ${extraRate}/${extraDuration})`;
    }

    descriptionElement.innerText = `At a rate of ${rateStr}/${durationStr}${extraStr}, ${prediction.rank.name} will be reached in ${formattedDuration}.`;
  }

  const predictionDate = new Date(
    prediction && prediction.duration !== Infinity
      ? Date.now() + prediction.duration * 1000
      : Date.now(),
  );

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
    const end = predictionDate.valueOf();
    const max = prediction?.rank.lowerBound ?? totalGamma * 1.2;

    // Add milestone lines
    countTagList.forEach((tag) => {
      if (tag.lowerBound <= max) {
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

  if (prediction && prediction.duration !== Infinity) {
    // Add prediction
    data.push({
      y: [totalGamma, prediction.rank.lowerBound],
      x: [Date.now(), predictionDate.valueOf()],
      type: 'scatter',
      marker: {
        color: Colors.primary(),
      },
      line: {
        dash: 'dot',
      },
    });
  }

  const layout = fromTemplate(layoutTemplate, {
    title: `Rank Prediction (${durationStr})`,
    yaxis: {
      title: 'Gamma',
      gridcolor: Colors.grid(),
    },
    xaxis: {
      type: 'date',
      gridcolor: Colors.grid(),
    },
  });

  Plotly.newPlot(`prediction-${durationStr}-diagram`, data, layout);
}

export function displayNextRankPredictions(
  transcriptions: Transcription[],
  refComment?: Comment,
): void {
  displayNextRankPrediction(transcriptions, Durations.hour, '1h', refComment);
  displayNextRankPrediction(transcriptions, Durations.day, '24h', refComment);
  displayNextRankPrediction(transcriptions, Durations.week, '7d', refComment);
  displayNextRankPrediction(transcriptions, Durations.year, '365d', refComment);
}
