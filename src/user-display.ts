import { getAllUserComments } from './reddit-api';
import { isComment } from './analizer';
import Transcription from './transcription';

function displayUserName(userName: string) {
  const userNameElement = document.getElementById('username') as HTMLElement;
  userNameElement.innerText = `/u/${userName}`;
}

async function getTranscriptions(userName: string): Promise<Transcription[]> {
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
  });

  return transcriptions;
}

function displayGamma(transcriptions: Transcription[]) {
  const gamma = transcriptions.length;

  const gammaElement = document.getElementById('scribe-count') as HTMLElement;
  gammaElement.innerHTML = `(${gamma} &#x393;)`;
}

async function displayUser() {
  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get('user');

  if (!userName) {
    return;
  }

  displayUserName(userName);

  const transcriptions = await getTranscriptions(userName);
  displayGamma(transcriptions);
}

document.addEventListener('DOMContentLoaded', () => {
  displayUser();
});
