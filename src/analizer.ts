import { Comment } from 'snoowrap';
import Logger from './logger';
import { getAllUserComments } from './reddit-api';

const logger = new Logger('Analizer');

/** Checks if a comment is an actual comment instead of a ToR bot interaction. */
function isComment(comment: Comment): boolean {
  return !(
    comment.subreddit_name_prefixed === 'r/TranscribersOfReddit' &&
    // Has one of the bot keywords
    /\b(done|(un)?claim(ing)?)\b/.test(comment.body)
  );
}

/** Checks if a comment is a transcription. */
function isTranscription(comment: Comment): boolean {
  // Recognizes the ToR footer. Note that there is an extra optional space, needed due to a malformed template
  const footerRegex = /\^\^I'm&#32;a&#32;human&#32;volunteer&#32;content&#32;transcriber&#32;for&#32;Reddit&#32;and&#32;you&#32;could&#32;be&#32;too!&#32;\[If&#32;(&#32;)?you'd&#32;like&#32;more&#32;information&#32;on&#32;what&#32;we&#32;do&#32;and&#32;why&#32;we&#32;do&#32;it,&#32;click&#32;here!\]\(https:\/\/www\.reddit\.com\/r\/TranscribersOfReddit\/wiki\/index\)/;

  // Check if the comment ends with the footer
  return footerRegex.test(comment.body);
}

/** Analizes the transcriptions of the given user. */
export default async function analizeUser(userName: string): Promise<void> {
  let allCount = 0;
  let commentCount = 0;
  let transcriptionCount = 0;

  await getAllUserComments(userName, (allComments) => {
    logger.debug(`Fetched ${allComments.length} comments`);
    allCount += allComments.length;

    const comments = allComments.filter((comment) => isComment(comment));
    commentCount += comments.length;

    const transcriptions = comments.filter((comment) => isTranscription(comment));
    transcriptionCount += transcriptions.length;
  });

  logger.info(
    `All comments fetched. All: ${allCount}, Comments: ${commentCount}, Transcriptions: ${transcriptionCount}`,
  );
}
