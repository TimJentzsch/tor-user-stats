import Transcription from '../transcription';

export type TranscriptionLength = {
  /** The total number of characters. */
  charTotal: number;
  /** The average number of characters. */
  charAvg: number;
  /** The maximum amount of characters. */
  charPeak: number;
  /** The total number of words. */
  wordTotal: number;
  /** The average number of words. */
  wordAvg: number;
  /** The maximum amount of words. */
  wordPeak: number;
};

/**
 * Analyzes the character and word count of the transcriptions.
 * @param transcriptions The transcriptions to analize.
 */
export function getTranscriptionLength(transcriptions: Transcription[]): TranscriptionLength {
  if (transcriptions.length === 0) {
    return {
      charTotal: 0,
      charAvg: 0,
      charPeak: 0,
      wordTotal: 0,
      wordAvg: 0,
      wordPeak: 0,
    };
  }

  const count = transcriptions.length;

  let charTotal = 0;
  let charPeak = 0;
  let wordTotal = 0;
  let wordPeak = 0;

  transcriptions.forEach((transcrition) => {
    // Determine character and word count of this transcriptions
    const charCount = transcrition.contentMD.length;
    const wordCount = transcrition.contentMD.split(/\s+/).length;

    charTotal += charCount;
    charPeak = Math.max(charPeak, charCount);

    wordTotal += wordCount;
    wordPeak = Math.max(wordPeak, wordCount);
  });

  return {
    charTotal,
    charAvg: charTotal / count,
    charPeak,
    wordTotal,
    wordAvg: wordTotal / count,
    wordPeak,
  };
}
