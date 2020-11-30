interface Tag {
  /** The name of the tag. */
  name: string;
  /** The hex color of the tag. */
  color: string;
}

interface CountTag extends Tag {
  /** The lower bound for the transcription count. */
  lowerBound: number;
  /** The upper bound for the transcription count. */
  upperBound: number;
}

// - SPECIAL TAGS -----------------------------------------

/** 100 transcriptions in 24h. */
const twentyFour: Tag = {
  name: '100/24h',
  color: '#fcec3c',
};

/** Mod on r/TranscribersOfReddit. */
const mod: Tag = {
  name: 'Mod',
  color: '#fc3c46',
};

export const specialTags = {
  twentyFour,
  mod,
};

// - COUNT TAGS -------------------------------------------

/** Visitor, 0. */
const visitor: CountTag = {
  name: 'Initiate',
  color: '#aaaaaa',
  lowerBound: 0,
  upperBound: 0,
};

/** Initiate, 1-49. */
const initiate: CountTag = {
  name: 'Initiate',
  color: '#eeeeee',
  lowerBound: 1,
  upperBound: 49,
};

/** Green, 50-99. */
const green: CountTag = {
  name: 'Green',
  color: '#46d160',
  lowerBound: 50,
  upperBound: 99,
};

/** Teal, 100-249. */
const teal: CountTag = {
  name: 'Teal',
  color: '#0aa18f',
  lowerBound: 100,
  upperBound: 249,
};

/** Purple, 250-499. */
const purple: CountTag = {
  name: 'Purple',
  color: '#7f00ff',
  lowerBound: 250,
  upperBound: 499,
};

/** Gold, 500-999. */
const gold: CountTag = {
  name: 'Gold',
  color: '#ffffff',
  lowerBound: 500,
  upperBound: 999,
};

/** Diamond, 1000-2499. */
const diamond: CountTag = {
  name: 'Diamond',
  color: '#b9f2ff',
  lowerBound: 1000,
  upperBound: 2499,
};

/** Ruby, 2500-4999. */
const ruby: CountTag = {
  name: 'Ruby',
  color: '#ff005d',
  lowerBound: 2500,
  upperBound: 4999,
};

/** Topaz, 5000-9999. */
const topaz: CountTag = {
  name: 'Topaz',
  color: '#ff6200',
  lowerBound: 5000,
  upperBound: 9999,
};

/** Jade, 10000+. */
const jade: CountTag = {
  name: 'Jade',
  color: '#307250',
  lowerBound: 10000,
  upperBound: Infinity,
};

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

/** All available tags. */
const tags = {
  specialTags,
  countTags,
};

export default tags;
