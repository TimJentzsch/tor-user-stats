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
  const rStart = Math.floor(sessionStart / 1000);

  const newComments = comments.filter((comment) => {
    return comment.created_utc >= rStart;
  });
  const newTranscriptions = newComments
    // Filter out new transcriptions
    .filter((comment) => {
      return Transcription.isTranscription(comment);
    });

  const gammaIncrease = newTranscriptions.length;

  updateElement('overlay-gamma-increase', gammaIncrease);
}

function updateOverlay(
  userName: string,
  comments: Comment[],
  gamma: number,
  refComment: Comment,
  sessionStart: number,
): Promise<[number, Comment[]]> {
  // Update the current gamma
  return refComment.refresh().then(async (ref) => {
    const newGamma = getGamma(ref);
    if (newGamma > gamma) {
      const commentFetch = await getUserComments(userName, {
        sort: 'new',
        limit: 20,
      });

      const newComments = commentFetch.filter((comment) => {
        return comment.created_utc > comments[0].created_utc;
      });

      const allComments = newComments.concat(comments);

      updateGammaIncrease(allComments, sessionStart);
      updateGamma(newGamma);
      updateNameStyle(newGamma);

      return [newGamma, allComments];
    }

    return [gamma, comments];
  });
}

function alignOverlay(hAlign: string | null, vAlign: string | null) {
  const container = document.getElementById('overlay-container') as HTMLDivElement;

  if (hAlign === 'left') {
    container.style.left = '0';
    container.style.textAlign = 'left';
  } else {
    container.style.right = '0';
    container.style.textAlign = 'right';
  }

  if (vAlign === 'bottom') {
    container.style.bottom = '0';
  } else {
    container.style.top = '0';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const date = urlParams.get('sessionStart');
  const sessionStart = date ? new Date(date).valueOf() : Date.now();
  alignOverlay(urlParams.get('hAlign'), urlParams.get('vAlign'));
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
  let gamma = getGamma(refComment);
  updateGamma(gamma);
  updateNameStyle(gamma);
  updateGammaIncrease(comments, sessionStart);

  setInterval(async () => {
    [gamma, comments] = await updateOverlay(userName, comments, gamma, refComment, sessionStart);
  }, 2000);
});
