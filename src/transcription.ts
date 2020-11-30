import { Comment } from 'snoowrap';

/**
 * Regular expression to recognize transcriptions. Groups:
 * - header: The header of the transcription.
 * - format: The format of the transcription, e.g. 'Image' or 'Video'.
 * - type: The type of the transcription, e.g. 'Twitter Post'.
 */
const headerRegex = /^\s*(?<header>\*?(?<format>.+?)\s+Transcription:\*?\s*(?<type>.*?)\*?\s*-{3,})\s*/;
/**
 * Regular expression to recognize transcriptions. Groups:
 * - content: The transcription content.
 */
const contentRegex = /(?<content>.*)/;
/**
 * Regular expression to recognize transcription footers. Groups:
 * - footer: The footer of the transcription.
 */
// Note: There are two types of footers, one has an extra '&#32;'. Both have to be recognized.
const footerRegex = /\s*(?<footer>\^\^I'm&#32;a&#32;human&#32;volunteer&#32;content&#32;transcriber&#32;for&#32;Reddit&#32;and&#32;you&#32;could&#32;be&#32;too!&#32;\[If&#32;(&#32;)?you'd&#32;like&#32;more&#32;information&#32;on&#32;what&#32;we&#32;do&#32;and&#32;why&#32;we&#32;do&#32;it,&#32;click&#32;here!\]\(https:\/\/www\.reddit\.com\/r\/TranscribersOfReddit\/wiki\/index\))\s*$/;
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

    if (match === null || match.groups === undefined) {
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

    this.headerMD = match.groups.header;
    this.format = match.groups.format;
    this.type = match.groups.type;
    this.contentMD = match.groups.content;
    this.footerMD = match.groups.footer;
  }

  /**
   * Creates a new transcription from a comment.
   * @param comment The comment to create the transcription from.
   */
  static fromComment(comment: Comment): Transcription {
    return new Transcription(
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
  static isTranscription(comment: Comment): boolean {
    return transcriptionRegex.test(comment.body);
  }
}
