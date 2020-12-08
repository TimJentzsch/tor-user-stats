import Transcription from '../transcription';
import { limitEnd } from '../util';
import { clearChildren } from './display-util';

/**
 * Converts the given transcription to an HTML element.
 * @param transcription The transcription to get the element of.
 */
export function getTranscriptionElement(transcription: Transcription): HTMLDivElement {
  const container = document.createElement('div');
  container.classList.add('transcription');

  const header = document.createElement('div');
  header.classList.add('transcription-header');
  container.appendChild(header);

  const karma = document.createElement('div');
  karma.classList.add('karma');
  if (transcription.score >= 0) {
    // Add a plus sign
    karma.innerText = `+${transcription.score}`;
  } else if (transcription.score === 0) {
    // Add a plus-minus sign
    karma.innerText = `\u00B1${transcription.score}`;
  } else {
    // The minus is added automatically
    karma.innerText = transcription.score.toString();
  }
  header.appendChild(karma);

  const subreddit = document.createElement('a');
  subreddit.classList.add('subreddit');
  subreddit.href = `https://www.reddit.com${transcription.permalink}`;
  subreddit.innerText = transcription.subredditNamePrefixed;
  header.appendChild(subreddit);

  const date = document.createElement('div');
  date.classList.add('date');
  date.innerText = new Date(transcription.createdUTC * 1000).toISOString().substr(0, 10);
  header.appendChild(date);

  const content = document.createElement('div');
  content.classList.add('transcription-content');
  content.innerHTML = transcription.bodyHTML;
  container.appendChild(content);

  return container;
}

/**
 * Displays the top 5 transcriptions.
 * @param transcriptions The transcriptions to display.
 */
export function displayHallOfFame(transcriptions: Transcription[]): void {
  const top5 = limitEnd(
    [...transcriptions].sort((a, b) => {
      return b.score - a.score;
    }),
    4,
  );

  const container = document.getElementById('hall-of-fame-container') as HTMLDivElement;
  clearChildren(container);

  top5.forEach((transcription) => {
    const element = getTranscriptionElement(transcription);
    container.appendChild(element);
  });
}
