import Transcription from '../src/transcription';
import { imageMD } from './transcription-templates';

export default class TranscriptionGenerator {
  /** The currently generated transcriptions. */
  protected transcriptions: Transcription[];
  /** The current time. */
  protected curTime: number;
  /** The next transcription ID. */
  protected nextId = 0;

  /** Creates a new transcription generator. */
  constructor(
    /** The time to start the generation at. */
    protected startDate: Date,
  ) {
    this.transcriptions = [];
    this.curTime = startDate.valueOf();
  }

  /**
   * Adds the given number of transcriptions in the specified timeframe.
   * @param count The number of transcriptions to add.
   * @param duration The duration in which the transcriptions have been made, in seconds.
   */
  public addTranscriptions(count: number, duration: number): TranscriptionGenerator {
    const timeIncr = duration / count;

    for (let i = 0; i < count; i += 1) {
      this.transcriptions.push(
        new Transcription(this.nextId.toString(), imageMD, '', this.curTime, 1, '/r/Old_Recipe'),
      );

      this.nextId += 1;
      this.curTime += timeIncr;
    }

    return this;
  }

  /**
   * Adds no transcriptions for the specified amount of time.
   * @param duration The duration to pause, in seconds.
   */
  public addPause(duration: number): TranscriptionGenerator {
    this.curTime += duration;
    return this;
  }

  /** Returns the generated transcriptions. */
  public generate(): Transcription[] {
    return this.transcriptions;
  }
}
