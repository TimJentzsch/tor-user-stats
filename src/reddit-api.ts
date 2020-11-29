import snoowrap, { Listing, Comment } from 'snoowrap';
import FS from 'fs';
import { v4 as uuidv4 } from 'uuid';
import appData from './app-data';

/** The config for the reddit API. */
type RedditConfig = {
  /** The reddit client ID. */
  clientId: string;
  /** The username of the app host. Does NOT include '/u/'. */
  userName: string;
};

// Load the reddit config
const redditConfig: RedditConfig = JSON.parse(
  FS.readFileSync('config/reddit.config.json', 'utf-8'),
);

/** The user agent, so that reddit knows who we are. */
const userAgent = `${appData.name}/v${appData.version} by /u/${redditConfig.userName}`;

// TODO: Save this per device
/** An ID identifying the current device. */
const deviceId = uuidv4().substr(0, 30); // Reddit allows only 30 chars

/** A 'user-less' requester for the reddit API. */
export const requester = snoowrap.fromApplicationOnlyAuth({
  userAgent,
  clientId: redditConfig.clientId,
  deviceId,
  grantType: 'https://oauth.reddit.com/grants/installed_client',
});

/** Get comments of the given user. */
export async function getUserComments(userName: string): Promise<Listing<Comment>> {
  const req = await requester;
  return req.getUser(userName).getComments();
}
