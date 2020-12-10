export class Tag {
  constructor(
    /** The id of the tag. */
    public id: string,
    /** The name of the tag. */
    public name: string,
  ) {}

  public toString(): string {
    return this.name;
  }
}

export class CountTag extends Tag {
  constructor(
    /** The name of the tag. */
    name: string,
    /** The lower bound for the transcription count. */
    public lowerBound: number,
    /** The upper bound for the transcription count. */
    public upperBound: number,
  ) {
    super(name.toLocaleLowerCase(), name);
  }

  public toString(): string {
    if (this.lowerBound === this.upperBound) {
      return `${this.name} (${this.lowerBound})`;
    }

    if (this.upperBound === Infinity) {
      return `${this.name} (${this.lowerBound}+)`;
    }

    return `${this.name} (${this.lowerBound}-${this.upperBound})`;
  }
}

// - SPECIAL TAGS -----------------------------------------

/** 100 transcriptions in 24h. */
const twentyFour = new Tag('twenty-four', '100/24h Club');

/** A beta tester. */
const betaTester = new Tag('beta-tester', 'Beta Tester');

/** Mod on r/TranscribersOfReddit. */
const mod = new Tag('mod', 'Mod');

export const specialTags = {
  twentyFour,
  betaTester,
  mod,
};

// - COUNT TAGS -------------------------------------------

/** Visitor, 0. */
const visitor = new CountTag('Visitor', 0, 0);

/** Initiate, 1-49. */
const initiate = new CountTag('Initiate', 1, 49);

/** Green, 50-99. */
const green = new CountTag('Green', 50, 99);

/** Teal, 100-249. */
const teal = new CountTag('Teal', 100, 249);

/** Purple, 250-499. */
const purple = new CountTag('Purple', 250, 499);

/** Gold, 500-999. */
const gold = new CountTag('Gold', 500, 999);

/** Diamond, 1000-2499. */
const diamond = new CountTag('Diamond', 1000, 2499);

/** Ruby, 2500-4999. */
const ruby = new CountTag('Ruby', 2500, 4999);

/** Topaz, 5000-9999. */
const topaz = new CountTag('Topaz', 5000, 9999);

/** Jade, 10000+. */
const jade = new CountTag('Jade', 10000, Infinity);

/** Tags for the transcription count. */
export const countTags = {
  visitor,
  initiate,
  green,
  teal,
  purple,
  gold,
  diamond,
  ruby,
  topaz,
  jade,
};

/** Tags for the transcription count. */
export const countTagList = [
  visitor,
  initiate,
  green,
  teal,
  purple,
  gold,
  diamond,
  ruby,
  topaz,
  jade,
];

/** All available tags. */
const tags = {
  specialTags,
  countTags: countTagList,
};

export default tags;
