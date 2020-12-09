import { getCountTag, getSpecialTags } from '../analizer';
import { countTags, Tag } from '../tags';
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

export async function displayTags(
  userName: string,
  transcriptions: Transcription[],
): Promise<void> {
  displayCountTag(transcriptions);

  const spTags = await getSpecialTags(userName, transcriptions);
  const spTagElements = spTags.map((tag) => getTagElement(tag));

  const tagContainer = document.getElementById('special-tag-container') as HTMLElement;
  tagContainer.innerHTML = '';
  spTagElements.forEach((tag) => tagContainer.appendChild(tag));
}
