import Durations from '../durations';
import { isToRMod } from '../reddit-api';
import { CountTag, countTagList, specialTags, Tag } from '../tags';
import Transcription from '../transcription';
import { gammaPeak } from './peak';

/**
 * Gets the matching count tag for the transcriptions.
 * @param transcriptions The transcriptions to analize.
 */
export function getCountTag(gamma: number): CountTag {
  // From the highest tag downwards, search for the first match
  for (let i = countTagList.length - 1; i >= 0; i -= 1) {
    if (gamma >= countTagList[i].lowerBound) {
      return countTagList[i];
    }
  }

  throw new Error(`No count tag found for count ${gamma}`);
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
  const dayPeak = gammaPeak(transcriptions, Durations.day); // 24h

  if (dayPeak.peak >= 100) {
    return specialTags.twentyFour;
  }

  return null;
}

/**
 * Returns the beta tester tag if the user has completed it, else null.
 * @param transcriptions The transcriptions to analyze.
 */
export function getBetaTesterTag(transcriptions: Transcription[]): Tag | null {
  if (transcriptions.length === 0) {
    return null;
  }

  // The end of the beta
  const betaDate = new Date('2021-12-31T00:00:00').valueOf() / 1000;
  // The time of the first transcription
  const firstDate = transcriptions[transcriptions.length - 1].createdUTC;

  if (firstDate <= betaDate) {
    return specialTags.betaTester;
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
  const betaTesterTag = getBetaTesterTag(transcriptions);

  return [twentyFourTag, betaTesterTag].filter((tag) => tag !== null) as Tag[];
}
