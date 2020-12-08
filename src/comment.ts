/** A Reddit comment. */
export default interface RComment {
  /** The unique ID of the comment. */
  id: string;
  /** The link to the comment. */
  permalink: string;
  /** The body of the comment, formatted in Reddit markdown. */
  body: string;
  /** The body of the comment, formatted in HTML. */
  body_html: string;
  /** The comment creation time, in seconds since midnight 1970-01-01 UTC. */
  created_utc: number;
  /** The karma score of the comment. */
  score: number;
  /** The name of the subreddit, in the form 'r/subreddit'. */
  subreddit_name_prefixed: string;
}
