import snoowrap from 'snoowrap';
import FS from 'fs';

/** The config for the reddit API. */
type RedditConfig = {
  /** The reddit client ID. */
  clientId: string;
};

const redditConfig: RedditConfig = JSON.parse(
  FS.readFileSync('config/reddit.config.json', 'utf-8'),
);
