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

  container.innerHTML = transcription.bodyHTML;

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
