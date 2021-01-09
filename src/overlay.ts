import { Comment } from 'snoowrap';
import { updateElement } from './display/display-util';
import { getUserComments } from './reddit-api';
import { getCountTag } from './stats/tags';
import { countTagList } from './tags';
import Transcription from './transcription';

function updateNameStyle(gamma: number): void {
  const countTag = getCountTag(gamma);
  const nameElement = document.getElementById('overlay-user-name') as HTMLSpanElement;

  countTagList.forEach((tag) => {
    nameElement.classList.remove(tag.id);
  });

  nameElement.classList.add(countTag.id);
}

function setUserName(userName: string): void {
  updateElement('overlay-reddit-name', userName);
}

function setTime(sessionStart: number): void {
  const elapsed = Date.now() - sessionStart;

  // Format the time
  const secNum = Math.floor(elapsed / 1000);
  const hours = Math.floor(secNum / 3600);
  const minutes = Math.floor((secNum - hours * 3600) / 60);
  const seconds = secNum - hours * 3600 - minutes * 60;

  const hourStr = `${hours}`.padStart(2, '0');
  const minutesStr = `${minutes}`.padStart(2, '0');
  const secondsStr = `${seconds}`.padStart(2, '0');
  const time = `${hourStr}:${minutesStr}:${secondsStr}`;

  updateElement('overlay-time', time);
}

function isRefComment(comment: Comment): boolean {
  return comment.subreddit_name_prefixed === 'r/TranscribersOfReddit';
}

function getGamma(refComment: Comment): number {
  const flair = refComment.author_flair_text ?? '';
  const match = /(\d+)\s*Γ/.exec(flair);
  const gamma = match ? match[1] : '0';

  return Number(gamma);
}

function updateGamma(gamma: number) {
  updateElement('overlay-gamma-total', gamma);
}

function updateGammaIncrease(comments: Comment[], sessionStart: number) {
  const newTranscriptions = comments
    // Filter out transcriptions
    .filter((comment) => {
      return Transcription.isTranscription(comment);
    })
    // Filter out new transcriptions
    .filter((transcription) => {
      return transcription.created_utc * 1000 >= sessionStart;
    });

  const gammaIncrease = newTranscriptions.length;

  updateElement('overlay-gamma-increase', gammaIncrease);
}

async function updateOverlay(
  userName: string,
  comments: Comment[],
  refComment: Comment,
  sessionStart: number,
): Promise<Comment[]> {
  // Update the current gamma
  refComment.refresh().then((ref) => {
    const gamma = getGamma(ref);
    updateGamma(gamma);
    updateNameStyle(gamma);
  });

  const commentFetch = await getUserComments(userName, {
    sort: 'new',
    limit: 100,
  });

  const newComments = commentFetch.filter((comment) => {
    return comment.created_utc > comments[0].created_utc;
  });

  const allComments = newComments.concat(comments);

  updateGammaIncrease(allComments, sessionStart);

  return allComments;
}

document.addEventListener('DOMContentLoaded', async () => {
  const sessionStart = Date.now();
  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get('user');

  // Update the time
  setInterval(setTime, 1000, sessionStart);

  if (!userName) {
    return;
  }

  setUserName(userName);

  // Find ref comment
  let comments: Comment[] = await getUserComments(userName, {
    sort: 'new',
    limit: 100,
  });

  const torComments = comments.filter(isRefComment);
  const refComment = torComments[0];
  const gamma = getGamma(refComment);
  updateGamma(gamma);
  updateNameStyle(gamma);

  setInterval(async () => {
    comments = await updateOverlay(userName, comments, refComment, sessionStart);
  }, 2000);
});
