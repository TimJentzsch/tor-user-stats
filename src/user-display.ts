import { Comment } from 'snoowrap';
import { getAllUserComments, getUserComments } from './reddit-api';
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
import { getGamma, updateElement } from './display/display-util';
import { displayHallOfFame, displayRecent } from './display/hall-of-fame';
import { displayModTag, displayTags } from './display/tags';
import { getTranscriptionLength } from './stats/length';
import { recentGamma, recentKarma } from './stats/recent';
import { displayNextRankPredictions } from './display/rank-prediction';
import Durations from './durations';

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
  // eslint-disable-next-line no-console
  console.debug(`Starting analysis for /u/${userName}:`);

  let allCount = 0;
  // let commentCount = 0;
  // let transcriptionCount = 0;
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

    // eslint-disable-next-line no-console
    console.debug(`Fetched ${count} comments, from ${endDate} to ${startDate}`);
    allCount += newComments.length;

    if (!refComment) {
      // Find a reference comment to get the user flair
      refComment = newComments.find((comment) => {
        return comment.subreddit_name_prefixed === 'r/TranscribersOfReddit';
      });
    }

    const newValidComments = newComments.filter((comment) => isComment(comment));
    // commentCount += newValidComments.length;

    const newTranscriptions = newValidComments
      .filter((comment) => Transcription.isTranscription(comment))
      .map((comment) => Transcription.fromComment(comment));
    // transcriptionCount += newTranscriptions.length;

    transcriptions = transcriptions.concat(newTranscriptions);

    callback(transcriptions, allCount, refComment);
  });

  return transcriptions;
}

function displayGamma(transcriptions: Transcription[], refComment: Comment | undefined): number {
  const gamma = getGamma(transcriptions, refComment);

  const gammaElement = document.getElementById('scribe-count') as HTMLElement;
  gammaElement.innerHTML = `(${gamma} &#x393;)`;

  return gamma;
}

function updateRecents(transcriptions: Transcription[]) {
  updateElement('recent-gamma-1h', recentGamma(transcriptions, Durations.hour).score);
  updateElement('recent-gamma-24h', recentGamma(transcriptions, Durations.day).score);
  updateElement('recent-gamma-7d', recentGamma(transcriptions, Durations.week).score);
  updateElement('recent-gamma-365d', recentGamma(transcriptions, Durations.year).score);

  updateElement('recent-karma-1h', recentKarma(transcriptions, Durations.hour).score);
  updateElement('recent-karma-24h', recentKarma(transcriptions, Durations.day).score);
  updateElement('recent-karma-7d', recentKarma(transcriptions, Durations.week).score);
  updateElement('recent-karma-365d', recentKarma(transcriptions, Durations.year).score);
}

function updatePeaks(transcriptions: Transcription[]) {
  updateElement('gamma-peak-1h', gammaPeak(transcriptions, Durations.hour).peak);
  updateElement('gamma-peak-24h', gammaPeak(transcriptions, Durations.day).peak);
  updateElement('gamma-peak-7d', gammaPeak(transcriptions, Durations.week).peak);
  updateElement('gamma-peak-365d', gammaPeak(transcriptions, Durations.year).peak);

  updateElement('karma-peak-1h', karmaPeak(transcriptions, Durations.hour).peak);
  updateElement('karma-peak-24h', karmaPeak(transcriptions, Durations.day).peak);
  updateElement('karma-peak-7d', karmaPeak(transcriptions, Durations.week).peak);
  updateElement('karma-peak-365d', karmaPeak(transcriptions, Durations.year).peak);
}

function updateAvgs(transcriptions: Transcription[]) {
  const accuracy = 2;

  updateElement('gamma-avg-1h', gammaAvg(transcriptions, Durations.hour).toFixed(accuracy));
  updateElement('gamma-avg-24h', gammaAvg(transcriptions, Durations.day).toFixed(accuracy));
  updateElement('gamma-avg-7d', gammaAvg(transcriptions, Durations.week).toFixed(accuracy));
  updateElement('gamma-avg-365d', gammaAvg(transcriptions, Durations.year).toFixed(accuracy));

  updateElement('karma-avg-1h', karmaAvg(transcriptions, Durations.hour).toFixed(accuracy));
  updateElement('karma-avg-24h', karmaAvg(transcriptions, Durations.day).toFixed(accuracy));
  updateElement('karma-avg-7d', karmaAvg(transcriptions, Durations.week).toFixed(accuracy));
  updateElement('karma-avg-365d', karmaAvg(transcriptions, Durations.year).toFixed(accuracy));
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

function updateAnalysis(
  transcriptions: Transcription[],
  refComment: Comment | undefined,
  commentCount: number,
) {
  const gamma = getGamma(transcriptions, refComment);

  updateElement('comment-count', commentCount);
  updateElement('transcription-count', transcriptions.length);
  updateElement('analysis-percent', ((transcriptions.length / gamma) * 100).toFixed(2));
}

function updateDisplays(
  userName: string,
  transcriptions: Transcription[],
  refComment: Comment | undefined,
  commentCount: number,
): number {
  const gamma = displayGamma(transcriptions, refComment);
  updateAnalysis(transcriptions, refComment, commentCount);
  displayTags(userName, transcriptions, refComment);
  updateTables(transcriptions);
  formatGammaDiagram(transcriptions);
  typeGammaDiagram(transcriptions);
  formatKarmaDiagram(transcriptions);
  typeKarmaDiagram(transcriptions);
  displaySubGammaDiagram(transcriptions);
  displaySubKarmaDiagram(transcriptions);
  gammaHistoryDiagram(transcriptions, refComment);
  gammaRateDiagram(transcriptions);
  karmaHistoryDiagram(transcriptions);
  karmaRateDiagram(transcriptions);
  displayHeatmap(transcriptions);
  displayHallOfFame(transcriptions);
  displayRecent(transcriptions);
  displayNextRankPredictions(transcriptions, refComment);

  return gamma;
}

async function updateTranscriptions(
  userName: string,
  transcriptions: Transcription[],
  refComment: Comment | undefined,
  gamma: number,
  commentCount: number,
): Promise<[number, number, Transcription[]]> {
  let newGamma = gamma;
  let newRef = refComment;
  if (refComment) {
    newGamma = await refComment.refresh().then((ref) => {
      newRef = ref;
      return getGamma(transcriptions, ref);
    });

    if (newGamma === gamma) {
      // No new transcriptions
      return [gamma, commentCount, transcriptions];
    }
  }

  // eslint-disable-next-line no-console
  console.debug(`Found ${newGamma - gamma} new transcription(s).`);

  // Fetch the most recent comments
  let recentComments = (await getUserComments(userName, {
    sort: 'new',
    limit: 25,
  })) as Comment[];
  if (transcriptions.length > 0) {
    recentComments = recentComments.filter((comment) => {
      return comment.created_utc > transcriptions[0].createdUTC;
    });
  }
  const newCommentCount = commentCount + recentComments.length;

  // Convert to transcriptions
  const recentTranscriptions = recentComments
    .filter((comment) => Transcription.isTranscription(comment))
    .map((comment) => Transcription.fromComment(comment));

  // Merge
  const newTranscriptions = recentTranscriptions.concat(transcriptions);

  // Update UI
  updateDisplays(userName, newTranscriptions, newRef, newCommentCount);

  return [newGamma, newCommentCount, newTranscriptions];
}

async function displayUser() {
  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get('user');

  if (!userName) {
    return;
  }

  displayUserName(userName);
  displayModTag(userName);

  let gamma = 0;
  let commentCount = 0;
  let transcriptions: Transcription[] = [];
  let refComment: Comment | undefined;

  await getTranscriptions(userName, (_transcriptions, _allCount, _refComment) => {
    transcriptions = _transcriptions;
    commentCount = _allCount;
    refComment = _refComment;
    gamma = updateDisplays(userName, _transcriptions, _refComment, _allCount);
    setProgress(_allCount / 1000);
  });

  setProgress(1);

  // Refresh every couple of seconds
  setInterval(async () => {
    [gamma, commentCount, transcriptions] = await updateTranscriptions(
      userName,
      transcriptions,
      refComment,
      gamma,
      commentCount,
    );
  }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
  initHeatmapTable();
  displayUser();
});
