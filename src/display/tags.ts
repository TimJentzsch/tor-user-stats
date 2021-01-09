import { Comment } from 'snoowrap';
import { getCountTag, getModTag, getSpecialTags } from '../stats/tags';
import { countTagList, Tag } from '../tags';
import Transcription from '../transcription';
import { getGamma } from './display-util';

export function getTagElement(tag: Tag): HTMLDivElement {
  const tagElement = document.createElement('div');
  tagElement.innerText = tag.toString();
  tagElement.classList.add('tag', tag.id);

  return tagElement;
}

export function displayCountTag(
  transcriptions: Transcription[],
  refComment: Comment | undefined,
): void {
  const gamma = getGamma(transcriptions, refComment);

  const countTag = getCountTag(gamma);
  const countTagElement = document.getElementById('count-tag') as HTMLDivElement;

  countTagList.forEach((tag) => {
    countTagElement.classList.remove(tag.id);
  });

  countTagElement.classList.add(countTag.id);
  countTagElement.innerText = countTag.toString();
}

export async function displayModTag(userName: string): Promise<void> {
  const modTag = await getModTag(userName);

  if (!modTag) {
    return;
  }

  const modTagElement = document.getElementById('mod-tag') as HTMLDivElement;

  modTagElement.classList.add(modTag.id);
  modTagElement.innerText = modTag.toString();
}

export function displayTags(
  userName: string,
  transcriptions: Transcription[],
  refComment: Comment | undefined,
): void {
  displayCountTag(transcriptions, refComment);

  const spTags = getSpecialTags(userName, transcriptions);
  const spTagElements = spTags.map((tag) => getTagElement(tag));

  const tagContainer = document.getElementById('special-tag-container') as HTMLElement;
  tagContainer.innerHTML = '';
  spTagElements.forEach((tag) => tagContainer.appendChild(tag));
}
