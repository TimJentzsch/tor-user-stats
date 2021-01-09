import { Comment, Listing } from 'snoowrap';
import { updateElement } from './display/display-util';
import { getUserComments } from './reddit-api';
import { getCountTag } from './stats/tags';
import { countTagList } from './tags';

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

function setGamma(gamma: number) {
  updateElement('overlay-gamma-total', gamma);
}

function updateOverlay(userName: string, comments: Listing<Comment>, refComment: Comment) {
  // Update the current gamma
  refComment.refresh().then((ref) => {
    const gamma = getGamma(ref);
    setGamma(gamma);
    updateNameStyle(gamma);
  });
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
  const comments = await getUserComments(userName, {
    sort: 'new',
    limit: 100,
  });

  const torComments = comments.filter(isRefComment);
  const refComment = torComments[0];
  const gamma = getGamma(refComment);
  setGamma(gamma);
  updateNameStyle(gamma);

  setInterval(updateOverlay, 2000, userName, comments, refComment);
});
