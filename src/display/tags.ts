import { getCountTag, getSpecialTags } from '../analizer';
import { Tag } from '../tags';
import Transcription from '../transcription';

export function getTagElement(tag: Tag): HTMLDivElement {
  const tagElement = document.createElement('div');
  tagElement.innerText = tag.toString();
  tagElement.classList.add('tag', tag.id);

  return tagElement;
}

export async function displayTags(
  userName: string,
  transcriptions: Transcription[],
): Promise<void> {
  const countTag = getCountTag(transcriptions);
  const countTagElement = getTagElement(countTag);

  const spTags = await getSpecialTags(userName, transcriptions);
  const spTagElements = spTags.map((tag) => getTagElement(tag));

  const tagContainer = document.getElementById('tag-container') as HTMLElement;
  tagContainer.innerHTML = '';
  tagContainer.appendChild(countTagElement);
  spTagElements.forEach((tag) => tagContainer.appendChild(tag));
}
