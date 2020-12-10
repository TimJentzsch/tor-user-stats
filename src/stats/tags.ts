import { isToRMod } from '../reddit-api';
import { CountTag, countTagList, specialTags, Tag } from '../tags';
import Transcription from '../transcription';
import { gammaPeak } from './peak';

/**
 * Gets the matching count tag for the transcriptions.
 * @param transcriptions The transcriptions to analize.
 */
export function getCountTag(transcriptions: Transcription[]): CountTag {
  const count = transcriptions.length;

  // From the highest tag downwards, search for the first match
  for (let i = countTagList.length - 1; i >= 0; i -= 1) {
    if (count >= countTagList[i].lowerBound) {
      return countTagList[i];
    }
  }

  throw new Error(`No count tag found for count ${count}`);
}

/**
 * Returns the mod tag if the user is a mod or null otherwise.
 * @param userName The username to get the mod tag for.
 */
export async function getModTag(userName: string): Promise<Tag | null> {
  const isMod = await isToRMod(userName);

  if (isMod) {
    return specialTags.mod;
  }

  return null;
}

/**
 * Returns the 100/24h tag if the user has completed it, else null.
 * @param transcriptions The transcriptions to analyze.
 */
export function getTwentyFourTag(transcriptions: Transcription[]): Tag | null {
  const dayPeak = gammaPeak(transcriptions, 24 * 60 * 60); // 24h

  if (dayPeak.peak >= 100) {
    return specialTags.twentyFour;
  }

  return null;
}

/**
 * Returns all special tags (except the mod tag) for the given user.
 * @param userName The user to check the special tags for.
 * @param transcriptions The transcriptions of the user.
 */
export function getSpecialTags(userName: string, transcriptions: Transcription[]): Tag[] {
  const twentyFourTag = getTwentyFourTag(transcriptions);

  return [twentyFourTag].filter((tag) => tag !== null) as Tag[];
}
