import { getAllUserComments } from './reddit-api';
import {
  getCountTag,
  getSpecialTags,
  getTranscriptionAmount,
  getTranscriptionAvg,
  getTranscriptionPeak,
  isComment,
} from './analizer';
import Transcription from './transcription';
import { Tag } from './tags';

function updateElement(id: string, text: string | number) {
  const element = document.getElementById(id) as HTMLElement;
  element.innerText = text.toString();
}

function displayUserName(userName: string) {
  const userNameElement = document.getElementById('username') as HTMLElement;
  userNameElement.innerText = `/u/${userName}`;
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

function getTagElement(tag: Tag): HTMLDivElement {
  const tagElement = document.createElement('div');
  tagElement.innerText = tag.toString();
  tagElement.classList.add('tag', tag.id);

  return tagElement;
}

async function displayTags(userName: string, transcriptions: Transcription[]) {
  const countTag = getCountTag(transcriptions);
  console.debug(`Count tag: ${countTag.toString()}`);
  const countTagElement = getTagElement(countTag);

  const spTags = await getSpecialTags(userName, transcriptions);
  const spTagElements = spTags.map((tag) => getTagElement(tag));

  const tagContainer = document.getElementById('tag-container') as HTMLElement;
  tagContainer.innerHTML = '';
  tagContainer.appendChild(countTagElement);
  spTagElements.forEach((tag) => tagContainer.appendChild(tag));
}

function updatePeaks(transcriptions: Transcription[]) {
  const hourPeak = getTranscriptionPeak(transcriptions, 60 * 60); // 1h
  const dayPeak = getTranscriptionPeak(transcriptions, 24 * 60 * 60); // 24h
  const weekPeak = getTranscriptionPeak(transcriptions, 7 * 24 * 60 * 60); // 7d
  const yearPeak = getTranscriptionPeak(transcriptions, 365 * 24 * 60 * 60); // 365d

  updateElement('peak-1h', hourPeak);
  updateElement('peak-24h', dayPeak);
  updateElement('peak-7d', weekPeak);
  updateElement('peak-365d', yearPeak);
}

function updateAvgs(transcriptions: Transcription[]) {
  const accuracy = 2;

  const hourAvg = getTranscriptionAvg(transcriptions, 60 * 60).toFixed(accuracy); // 1h
  const dayAvg = getTranscriptionAvg(transcriptions, 24 * 60 * 60).toFixed(accuracy); // 24h
  const weekAvg = getTranscriptionAvg(transcriptions, 7 * 24 * 60 * 60).toFixed(accuracy); // 7d
  const yearAvg = getTranscriptionAvg(transcriptions, 365 * 24 * 60 * 60).toFixed(accuracy); // 365d

  updateElement('avg-1h', hourAvg);
  updateElement('avg-24h', dayAvg);
  updateElement('avg-7d', weekAvg);
  updateElement('avg-365d', yearAvg);
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
  displayUser();
});
