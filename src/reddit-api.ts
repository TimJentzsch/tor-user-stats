import snoowrap, { Listing, Comment } from 'snoowrap';
import appData from './app-data';
import Logger from './logger';
import config from '../config/reddit.config.json';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = new Logger('Reddit');

/** The config for the reddit API. */
type RedditConfig = {
  /** The reddit client ID. */
  clientId: string;
  /** The username of the app host. Does NOT include '/u/'. */
  userName: string;
};

export const redditConfig = config as RedditConfig;

/** The user agent, so that reddit knows who we are. */
export function userAgent(): string {
  return `${appData.name}/v${appData.version} by /u/${redditConfig.userName}`;
}

// Anonymous client
const deviceId = 'DO_NOT_TRACK_THIS_DEVICE';

/** A 'user-less' requester for the reddit API. */
export function requester(): Promise<snoowrap> {
  return snoowrap.fromApplicationOnlyAuth({
    userAgent: userAgent(),
    clientId: redditConfig.clientId,
    deviceId,
    grantType: 'https://oauth.reddit.com/grants/installed_client',
  });
}

/** Get comments of the given user. */
export async function getUserComments(
  userName: string,
  options: unknown,
): Promise<Listing<Comment>> {
  const req = await requester();
  return req.getUser(userName).getComments(options);
}

/**
 * Gets all comments of the given user.
 * @param userName The user to get the comments of.
 * @param callback The function to call whenever new comments are available.
 */
export async function getAllUserComments(
  userName: string,
  callback: (comments: Listing<Comment>) => void,
): Promise<void> {
  const batchSize = 100;

  let comments = await getUserComments(userName, {
    sort: 'new',
    limit: batchSize,
  });
  callback(comments);

  while (comments.length === batchSize) {
    // Note: The await IS necessary
    // eslint-disable-next-line no-await-in-loop
    comments = await comments.fetchMore({
      amount: batchSize,
      skipReplies: true,
      append: false,
    });
    callback(comments);
  }
}

/**
 * Determines if the given user is a mod in /r/TranscribersOfReddit.
 * @param userName The user to check.
 */
export async function isToRMod(userName: string): Promise<boolean> {
  // Hide mods in their probation period
  if (config.probationMods.includes(userName)) {
    return false;
  }

  const req = await requester();
  const tor = req.getSubreddit('TranscribersOfReddit');
  // Note: This await IS needed
  const mods = await tor.getModerators();

  // Check if the user is one of the mods
  return (
    mods.findIndex((mod) => mod.name.toLocaleLowerCase() === userName.toLocaleLowerCase()) >= 0
  );
}
