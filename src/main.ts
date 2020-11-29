import Logger from './logger';
import { getAllUserComments, redditConfig } from './reddit-api';

const logger = new Logger('Main');

export default function helloWorld(): string {
  return 'Hello World!';
}

async function logComments(): Promise<void> {
  await getAllUserComments(redditConfig.userName, (comments) => {
    logger.debug(`Fetched ${comments.length} comments`);
  });
  logger.info(`All comments fetched.`);
}

logComments();
