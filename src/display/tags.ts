import { getCountTag, getModTag, getSpecialTags } from '../analizer';
import { isToRMod } from '../reddit-api';
import { countTags, specialTags, Tag } from '../tags';
import Transcription from '../transcription';

export function getTagElement(tag: Tag): HTMLDivElement {
  const tagElement = document.createElement('div');
  tagElement.innerText = tag.toString();
  tagElement.classList.add('tag', tag.id);

  return tagElement;
}

export function displayCountTag(transcriptions: Transcription[]): void {
  const countTag = getCountTag(transcriptions);
  const countTagElement = document.getElementById('count-tag') as HTMLDivElement;

  countTags.forEach((tag) => {
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

export function displayTags(userName: string, transcriptions: Transcription[]): void {
  displayCountTag(transcriptions);

  const spTags = getSpecialTags(userName, transcriptions);
  const spTagElements = spTags.map((tag) => getTagElement(tag));

  const tagContainer = document.getElementById('special-tag-container') as HTMLElement;
  tagContainer.innerHTML = '';
  spTagElements.forEach((tag) => tagContainer.appendChild(tag));
}
