import snoowrap from 'snoowrap';
import FS from 'fs';

/** The config for the reddit API. */
type RedditConfig = {
  /** The reddit client ID. */
  clientId: string;
  /** The username of the app host. Does NOT include '/u/'. */
  userName: string;
};

const redditConfig: RedditConfig = JSON.parse(
  FS.readFileSync('config/reddit.config.json', 'utf-8'),
);
