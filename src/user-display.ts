import { getAllUserComments } from './reddit-api';
import { getCountTag, getSpecialTags, getTranscriptionAmount, isComment } from './analizer';
import Transcription from './transcription';
import { Tag } from './tags';
import {
  formatGammaDiagram,
  gammaHistoryDiagram,
  gammaRateDiagram,
  displaySubGammaDiagram,
  displaySubKarmaDiagram,
  typeGammaDiagram,
  karmaHistoryDiagram,
  formatKarmaDiagram,
  typeKarmaDiagram,
  karmaRateDiagram,
} from './display/diagrams';
import { gammaPeak, karmaPeak } from './stats/peak';
import { gammaAvg, karmaAvg } from './stats/avg';
import { displayHeatmap, initHeatmapTable } from './display/heatmap';
import { updateElement } from './display/display-util';
import { displayHallOfFame, displayRecent } from './display/hall-of-fame';
import { displayTags } from './display/tags';

function searchUserHeader() {
  const input = document.getElementById('header-user-input') as HTMLInputElement;
  const userName = input.value;

  window.location.href = `user.html?user=${userName}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('header-search-form');
  searchForm?.addEventListener('submit', () => {
    searchUserHeader();
    return false;
  });
});

function displayUserName(userName: string) {
  const userNameElement = document.getElementById('username') as HTMLElement;
  userNameElement.innerText = `/u/${userName}`;

  const userLink = document.getElementById('user-link') as HTMLLinkElement;
  userLink.href = `https://www.reddit.com/u/${userName}/comments`;
}

function setProgress(progress: number) {
  const progressBar = document.getElementById('progress-bar') as HTMLProgressElement;
  progressBar.value = progress;
}

async function getTranscriptions(
  userName: string,
  callback: (transcriptions: Transcription[], allCount: number) => void,
): Promise<Transcription[]> {
  console.debug(`Starting analysis for /u/${userName}:`);

  let allCount = 0;
  let commentCount = 0;
  let transcriptionCount = 0;

  let transcriptions: Transcription[] = [];

  await getAllUserComments(userName, (newComments) => {
    if (newComments.length === 0) {
      return;
    }

    const endDate = new Date(newComments[0].created_utc * 1000).toISOString();
    const startDate = new Date(
      newComments[newComments.length - 1].created_utc * 1000,
    ).toISOString();

    const count = `${newComments.length}`.padStart(3);

    console.debug(`Fetched ${count} comments, from ${endDate} to ${startDate}`);
    allCount += newComments.length;

    const newValidComments = newComments.filter((comment) => isComment(comment));
    commentCount += newValidComments.length;

    const newTranscriptions = newValidComments
      .filter((comment) => Transcription.isTranscription(comment))
      .map((comment) => Transcription.fromComment(comment));
    transcriptionCount += newTranscriptions.length;

    transcriptions = transcriptions.concat(newTranscriptions);

    callback(transcriptions, allCount);
  });

  return transcriptions;
}

function displayGamma(transcriptions: Transcription[]) {
  const gamma = transcriptions.length;

  const gammaElement = document.getElementById('scribe-count') as HTMLElement;
  gammaElement.innerHTML = `(${gamma} &#x393;)`;
}

function updatePeaks(transcriptions: Transcription[]) {
  const gammaHourPeak = gammaPeak(transcriptions, 60 * 60); // 1h
  const gammaDayPeak = gammaPeak(transcriptions, 24 * 60 * 60); // 24h
  const gammaWeekPeak = gammaPeak(transcriptions, 7 * 24 * 60 * 60); // 7d
  const gammaYearPeak = gammaPeak(transcriptions, 365 * 24 * 60 * 60); // 365d

  updateElement('gamma-peak-1h', gammaHourPeak.peak);
  updateElement('gamma-peak-24h', gammaDayPeak.peak);
  updateElement('gamma-peak-7d', gammaWeekPeak.peak);
  updateElement('gamma-peak-365d', gammaYearPeak.peak);

  const karmaHourPeak = karmaPeak(transcriptions, 60 * 60); // 1h
  const karmaDayPeak = karmaPeak(transcriptions, 24 * 60 * 60); // 24h
  const karmaWeekPeak = karmaPeak(transcriptions, 7 * 24 * 60 * 60); // 7d
  const karmaYearPeak = karmaPeak(transcriptions, 365 * 24 * 60 * 60); // 365d

  updateElement('karma-peak-1h', karmaHourPeak.peak);
  updateElement('karma-peak-24h', karmaDayPeak.peak);
  updateElement('karma-peak-7d', karmaWeekPeak.peak);
  updateElement('karma-peak-365d', karmaYearPeak.peak);
}

function updateAvgs(transcriptions: Transcription[]) {
  const accuracy = 2;

  const gammaHourAvg = gammaAvg(transcriptions, 60 * 60).toFixed(accuracy); // 1h
  const gammaDayAvg = gammaAvg(transcriptions, 24 * 60 * 60).toFixed(accuracy); // 24h
  const gammaWeekAvg = gammaAvg(transcriptions, 7 * 24 * 60 * 60).toFixed(accuracy); // 7d
  const gammaYearAvg = gammaAvg(transcriptions, 365 * 24 * 60 * 60).toFixed(accuracy); // 365d

  updateElement('gamma-avg-1h', gammaHourAvg);
  updateElement('gamma-avg-24h', gammaDayAvg);
  updateElement('gamma-avg-7d', gammaWeekAvg);
  updateElement('gamma-avg-365d', gammaYearAvg);

  const karmaHourAvg = karmaAvg(transcriptions, 60 * 60).toFixed(accuracy); // 1h
  const karmaDayAvg = karmaAvg(transcriptions, 24 * 60 * 60).toFixed(accuracy); // 24h
  const karmaWeekAvg = karmaAvg(transcriptions, 7 * 24 * 60 * 60).toFixed(accuracy); // 7d
  const karmaYearAvg = karmaAvg(transcriptions, 365 * 24 * 60 * 60).toFixed(accuracy); // 365d

  updateElement('karma-avg-1h', karmaHourAvg);
  updateElement('karma-avg-24h', karmaDayAvg);
  updateElement('karma-avg-7d', karmaWeekAvg);
  updateElement('karma-avg-365d', karmaYearAvg);
}

function updateCharWords(transcriptions: Transcription[]) {
  const amounts = getTranscriptionAmount(transcriptions);

  updateElement('char-total', amounts.charTotal);
  updateElement('char-peak', amounts.charPeak);
  updateElement('char-avg', amounts.charAvg.toFixed(2));
  updateElement('word-total', amounts.wordTotal);
  updateElement('word-peak', amounts.wordPeak);
  updateElement('word-avg', amounts.wordAvg.toFixed(2));
}

function updateTables(transcriptions: Transcription[]) {
  updatePeaks(transcriptions);
  updateAvgs(transcriptions);
  updateCharWords(transcriptions);
}

function updateDisplays(userName: string, transcriptions: Transcription[]) {
  displayGamma(transcriptions);
  displayTags(userName, transcriptions);
  updateTables(transcriptions);
  formatGammaDiagram(transcriptions);
  typeGammaDiagram(transcriptions);
  formatKarmaDiagram(transcriptions);
  typeKarmaDiagram(transcriptions);
  displaySubGammaDiagram(transcriptions);
  displaySubKarmaDiagram(transcriptions);
  gammaHistoryDiagram(transcriptions);
  gammaRateDiagram(transcriptions);
  karmaHistoryDiagram(transcriptions);
  karmaRateDiagram(transcriptions);
  displayHeatmap(transcriptions);
  displayHallOfFame(transcriptions);
  displayRecent(transcriptions);
}

async function displayUser() {
  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get('user');

  if (!userName) {
    return;
  }

  displayUserName(userName);

  await getTranscriptions(userName, (transcriptions, allCount) => {
    updateDisplays(userName, transcriptions);
    setProgress(allCount / 1000);
  });

  setProgress(1);
}

document.addEventListener('DOMContentLoaded', () => {
  initHeatmapTable();
  displayUser();
});
