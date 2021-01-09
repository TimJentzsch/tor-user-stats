import { Comment } from 'snoowrap';
import { getAllUserComments } from './reddit-api';
import { isComment } from './analizer';
import Transcription from './transcription';
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
import { displayModTag, displayTags } from './display/tags';
import { getTranscriptionLength } from './stats/length';
import { recentGamma, recentKarma } from './stats/recent';

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
  callback: (
    transcriptions: Transcription[],
    allCount: number,
    refComment: Comment | undefined,
  ) => void,
): Promise<Transcription[]> {
  console.debug(`Starting analysis for /u/${userName}:`);

  let allCount = 0;
  let commentCount = 0;
  let transcriptionCount = 0;
  let refComment: Comment | undefined;

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

    if (!refComment) {
      // Find a reference comment to get the user flair
      refComment = newComments.find((comment) => {
        return comment.subreddit_name_prefixed === 'r/TranscribersOfReddit';
      });
    }

    const newValidComments = newComments.filter((comment) => isComment(comment));
    commentCount += newValidComments.length;

    const newTranscriptions = newValidComments
      .filter((comment) => Transcription.isTranscription(comment))
      .map((comment) => Transcription.fromComment(comment));
    transcriptionCount += newTranscriptions.length;

    transcriptions = transcriptions.concat(newTranscriptions);

    callback(transcriptions, allCount, refComment);
  });

  return transcriptions;
}

function displayGamma(transcriptions: Transcription[], refComment: Comment | undefined) {
  let gamma = transcriptions.length;

  if (refComment) {
    // Take the flair gamma if available
    const flair = refComment.author_flair_text ?? '';
    const match = /(\d+)\s*Γ/.exec(flair);
    gamma = Number(match ? match[1] : `${gamma}`);
  }

  const gammaElement = document.getElementById('scribe-count') as HTMLElement;
  gammaElement.innerHTML = `(${gamma} &#x393;)`;
}

function updateRecents(transcriptions: Transcription[]) {
  updateElement('recent-gamma-1h', recentGamma(transcriptions, 60 * 60).score);
  updateElement('recent-gamma-24h', recentGamma(transcriptions, 24 * 60 * 60).score);
  updateElement('recent-gamma-7d', recentGamma(transcriptions, 7 * 24 * 60 * 60).score);
  updateElement('recent-gamma-365d', recentGamma(transcriptions, 365 * 24 * 60 * 60).score);

  updateElement('recent-karma-1h', recentKarma(transcriptions, 60 * 60).score);
  updateElement('recent-karma-24h', recentKarma(transcriptions, 24 * 60 * 60).score);
  updateElement('recent-karma-7d', recentKarma(transcriptions, 7 * 24 * 60 * 60).score);
  updateElement('recent-karma-365d', recentKarma(transcriptions, 365 * 24 * 60 * 60).score);
}

function updatePeaks(transcriptions: Transcription[]) {
  updateElement('gamma-peak-1h', gammaPeak(transcriptions, 60 * 60).peak);
  updateElement('gamma-peak-24h', gammaPeak(transcriptions, 24 * 60 * 60).peak);
  updateElement('gamma-peak-7d', gammaPeak(transcriptions, 7 * 24 * 60 * 60).peak);
  updateElement('gamma-peak-365d', gammaPeak(transcriptions, 365 * 24 * 60 * 60).peak);

  updateElement('karma-peak-1h', karmaPeak(transcriptions, 60 * 60).peak);
  updateElement('karma-peak-24h', karmaPeak(transcriptions, 24 * 60 * 60).peak);
  updateElement('karma-peak-7d', karmaPeak(transcriptions, 7 * 24 * 60 * 60).peak);
  updateElement('karma-peak-365d', karmaPeak(transcriptions, 365 * 24 * 60 * 60).peak);
}

function updateAvgs(transcriptions: Transcription[]) {
  const accuracy = 2;

  updateElement('gamma-avg-1h', gammaAvg(transcriptions, 60 * 60).toFixed(accuracy));
  updateElement('gamma-avg-24h', gammaAvg(transcriptions, 24 * 60 * 60).toFixed(accuracy));
  updateElement('gamma-avg-7d', gammaAvg(transcriptions, 7 * 24 * 60 * 60).toFixed(accuracy));
  updateElement('gamma-avg-365d', gammaAvg(transcriptions, 365 * 24 * 60 * 60).toFixed(accuracy));

  updateElement('karma-avg-1h', karmaAvg(transcriptions, 60 * 60).toFixed(accuracy));
  updateElement('karma-avg-24h', karmaAvg(transcriptions, 24 * 60 * 60).toFixed(accuracy));
  updateElement('karma-avg-7d', karmaAvg(transcriptions, 7 * 24 * 60 * 60).toFixed(accuracy));
  updateElement('karma-avg-365d', karmaAvg(transcriptions, 365 * 24 * 60 * 60).toFixed(accuracy));
}

function updateCharWords(transcriptions: Transcription[]) {
  const amounts = getTranscriptionLength(transcriptions);

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
  updateRecents(transcriptions);
  updateCharWords(transcriptions);
}

function updateDisplays(
  userName: string,
  transcriptions: Transcription[],
  refComment: Comment | undefined,
) {
  displayGamma(transcriptions, refComment);
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
  displayModTag(userName);

  await getTranscriptions(userName, (transcriptions, allCount, refComment) => {
    updateDisplays(userName, transcriptions, refComment);
    setProgress(allCount / 1000);
  });

  setProgress(1);
}

document.addEventListener('DOMContentLoaded', () => {
  initHeatmapTable();
  displayUser();
});
