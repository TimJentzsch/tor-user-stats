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
  console.debug(`Session start: ${rStart}`);

  const newComments = comments.filter((comment) => {
    return comment.created_utc >= rStart;
  });
  const newTranscriptions = newComments
    // Filter out new transcriptions
    .filter((comment) => {
      return Transcription.isTranscription(comment);
    });

  console.debug(
    `Comments: ${comments.length}, New Comments: ${newComments.length}, New Transcriptions: ${newTranscriptions.length}`,
  );

  const gammaIncrease = newTranscriptions.length;

  updateElement('overlay-gamma-increase', gammaIncrease);
}

async function updateOverlay(
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
      console.debug(`Gamma updated from ${gamma} to ${newGamma}`);
      const commentFetch = await getUserComments(userName, {
        sort: 'new',
        limit: 20,
      });

      console.debug(
        `Comment fetch times: ${JSON.stringify(
          commentFetch.map((comment) => comment.created_utc),
        )}`,
      );

      console.debug(`Comment length: ${comments.length}`);

      console.debug(
        `Last comment time: ${comments[0].created_utc}, Cur time: ${Math.floor(Date.now() / 1000)}`,
      );

      const newComments = commentFetch.filter((comment) => {
        return comment.created_utc > comments[0].created_utc;
      });

      console.debug(
        `New comment times: ${JSON.stringify(newComments.map((comment) => comment.created_utc))}`,
      );

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
  const overlayContainer = document.getElementById('overlay-container') as HTMLDivElement;
  const body = document.getElementsByTagName('body')[0];

  if (hAlign === 'left') {
    overlayContainer.style.textAlign = 'left';
    body.style.justifyContent = 'start';
  } else {
    overlayContainer.style.textAlign = 'right';
    body.style.justifyContent = 'end';
  }

  if (vAlign === 'bottom') {
    overlayContainer.style.alignSelf = 'flex-end';
  } else {
    overlayContainer.style.alignSelf = 'flex-start';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const sessionStart = Date.now();
  const urlParams = new URLSearchParams(window.location.search);
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

  setInterval(async () => {
    [gamma, comments] = await updateOverlay(userName, comments, gamma, refComment, sessionStart);
  }, 2000);
});
