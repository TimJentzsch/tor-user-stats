import RComment from './comment';

/**
 * Regular expression to recognize transcriptions. Groups:
 * - header: The header of the transcription.
 * - format: The format of the transcription, e.g. 'Image' or 'Video'.
 * - type: The type of the transcription, e.g. 'Twitter Post'.
 */
const headerRegex = /^\s*(\*?(.+?)\s+Transcription:?\*?\s*(.*?)\*?\s*\n(?:-\s*){3,})\s*/;
/**
 * Regular expression to recognize transcriptions. Groups:
 * - content: The transcription content.
 */
const contentRegex = /(.*?)/;
/**
 * Regular expression to recognize transcription footers. Groups:
 * - footer: The footer of the transcription.
 */
// Note: There are three types of footers, one doesn't have the human part, the other has an extra '&#32;'. All have to be recognized.
const footerRegex = /\s*\n(?:-\s*){3,}(\^?\^?I'm&#32;a&#32;(human&#32;)?volunteer&#32;content&#32;transcriber&#32;for&#32;Reddit&#32;and&#32;you&#32;could&#32;be&#32;too!&#32;\[If&#32;(&#32;)?you'd&#32;like&#32;more&#32;information&#32;on&#32;what&#32;we&#32;do&#32;and&#32;why&#32;we&#32;do&#32;it,&#32;click&#32;here!\]\(https:\/\/www\.reddit\.com\/r\/TranscribersOfReddit\/wiki\/index\))\s*$/;

/** A more relaxed version of the footer for April 1st. */
const apr1FooterRegex = /\s*\n(?:-\s*){3,}.*?https:\/\/www\.reddit\.com\/r\/TranscribersOfReddit\/wiki\/index.*?$/;

/**
 * Regular expression to recognize transcriptions. Groups:
 * - header: The header of the transcription.
 * - format: The format of the transcription, e.g. 'Image' or 'Video'.
 * - type: The type of the transcription, e.g. 'Twitter Post'.
 * - content: The transcription content.
 * - footer: The footer of the transcription.
 */
const transcriptionRegex = new RegExp(
  headerRegex.source + contentRegex.source + footerRegex.source,
  // Multiline, allow '.' to match newline characters and be case-insensitive
  'msi',
);

/** Relaxed version for April 1st. */
const apr1TranscriptonRegex = new RegExp(
  headerRegex.source + contentRegex.source + apr1FooterRegex.source,
  // Multiline, allow '.' to match newline characters and be case-insensitive
  'msi',
);

export default class Transcription {
  /** The header of the transcription, formatted in reddit markdown. */
  public headerMD: string;
  /** The format of the transcription, e.g. 'Image' or 'Video'. */
  public format: string;
  /** The type of the transcription, e.g. 'Twitter Post'. */
  public type: string;
  /** The content of the transcription, formatted in reddit markdown. */
  public contentMD: string;
  /** The footer of the transcription, formatted in reddit markdown. */
  public footerMD: string;

  constructor(
    /** The ID of the comment. */
    public id: string,
    /** The link to the comment. */
    public permalink: string,
    /** The full body of the transcription, formatted in reddit markdown. */
    public bodyMD: string,
    /** The full body of the transcription, formatted in HTML. */
    public bodyHTML: string,
    /** The creation time of the transcription, in seconds since midnight 1970-01-01 UTC. */
    public createdUTC: number,
    /** The score of the transcription. */
    public score: number,
    /** The name of the subreddit, in the format 'r/subreddit'. */
    public subredditNamePrefixed: string,
  ) {
    // Extract transcription-specific attributes
    const match = transcriptionRegex.exec(bodyMD);

    if (match === null) {
      if (!footerRegex.test(bodyMD)) {
        throw new Error(
          `Failed to convert comment to transcription, footer not found:\n<<<${bodyMD}>>>`,
        );
      }
      if (!headerRegex.test(bodyMD)) {
        throw new Error(
          `Failed to convert comment to transcription, header not found:\n<<<${bodyMD}>>>`,
        );
      }
      throw new Error(`Failed to convert comment to transcription:\n<<<${bodyMD}>>>`);
    }

    this.headerMD = match[1];
    this.contentMD = match[4];
    this.footerMD = match[5];

    let format = match[2];
    let type = match[3];

    // Simplify format
    if (/image/i.test(format)) {
      format = 'Image';
    } else if (/video/i.test(format)) {
      format = 'Video';
    } else if (/gif/i.test(format) || /gif/i.test(type)) {
      format = 'GIF';
    }

    // Simplify some common types
    if (/twitter/i.test(type)) {
      type = 'Twitter';
    } else if (/facebook/i.test(type)) {
      type = 'Facebook';
    } else if (/tumblr/i.test(type)) {
      type = 'Tumblr';
    } else if (/reddit/i.test(type)) {
      type = 'Reddit';
    } else if (/greentext|4chan/i.test(type)) {
      type = 'Greentext';
    } else if (/youtube/i.test(type)) {
      type = 'YouTube';
    } else if (/message|discord|chat/i.test(type)) {
      type = 'Chat';
    } else if (!type) {
      type = format;
    }

    this.format = format;
    this.type = type;
  }

  /**
   * Creates a new transcription from a comment.
   * @param comment The comment to create the transcription from.
   */
  static fromComment(comment: RComment): Transcription {
    return new Transcription(
      comment.id,
      comment.permalink,
      comment.body,
      comment.body_html,
      comment.created_utc,
      comment.score,
      comment.subreddit_name_prefixed,
    );
  }

  /**
   * Checks if a comment is a transcription.
   * @param comment The comment to check.
   */
  static isTranscription(comment: RComment): boolean {
    // Has the transcription been posted to a test subreddit?
    const isTest = ['r/TranscribersOfReddit', 'r/kierra'].includes(comment.subreddit_name_prefixed);

    if (isTest) {
      return false;
    }

    const date = new Date(comment.created_utc * 1000);
    const month = date.getUTCMonth() + 1; // This is zero-indexed
    const day = date.getUTCDate(); // This is one-indexed

    // Check for April 1st (with buffer of a day to account for timezones)
    if ((month === 4 && day <= 2) || (month === 3 && day === 31)) {
      // Is the transcription formatted correctly (relaxed version)?
      return apr1TranscriptonRegex.test(comment.body);
    }

    // Is the transcription formatted correctly?
    return transcriptionRegex.test(comment.body);
  }
}
