export class Tag {
  constructor(
    /** The id of the tag. */
    public id: string,
    /** The name of the tag. */
    public name: string,
    /** The hex color of the tag. */
    public color: string,
  ) {}

  public toString(): string {
    return this.name;
  }
}

export class CountTag extends Tag {
  constructor(
    name: string,
    color: string,
    /** The lower bound for the transcription count. */
    public lowerBound: number,
    /** The upper bound for the transcription count. */
    public upperBound: number,
  ) {
    super(name.toLocaleLowerCase(), name, color);
  }

  public toString(): string {
    return `${this.name} (${this.lowerBound}-${this.upperBound})`;
  }
}

// - SPECIAL TAGS -----------------------------------------

/** 100 transcriptions in 24h. */
const twentyFour = new Tag('twentyFour', '100/24h Club', '#fcec3c');

/** Mod on r/TranscribersOfReddit. */
const mod = new Tag('mod', 'Mod', '#fc3c46');

export const specialTags = {
  twentyFour,
  mod,
};

// - COUNT TAGS -------------------------------------------

/** Visitor, 0. */
const visitor = new CountTag('Initiate', '#aaaaaa', 0, 0);

/** Initiate, 1-49. */
const initiate = new CountTag('Initiate', '#eeeeee', 1, 49);

/** Green, 50-99. */
const green = new CountTag('Green', '#46d160', 50, 99);

/** Teal, 100-249. */
const teal = new CountTag('Teal', '#0aa18f', 100, 249);

/** Purple, 250-499. */
const purple = new CountTag('Purple', '#7f00ff', 250, 499);

/** Gold, 500-999. */
const gold = new CountTag('Gold', '#ffffff', 500, 999);

/** Diamond, 1000-2499. */
const diamond = new CountTag('Diamond', '#b9f2ff', 1000, 2499);

/** Ruby, 2500-4999. */
const ruby = new CountTag('Ruby', '#ff005d', 2500, 4999);

/** Topaz, 5000-9999. */
const topaz = new CountTag('Topaz', '#ff6200', 5000, 9999);

/** Jade, 10000+. */
const jade = new CountTag('Jade', '#307250', 10000, Infinity);

/** Tags for the transcription count. */
export const countTags = [visitor, initiate, green, teal, purple, gold, diamond, ruby, topaz, jade];

/** All available tags. */
const tags = {
  specialTags,
  countTags,
};

export default tags;
