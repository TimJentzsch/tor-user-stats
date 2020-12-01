import analizeUser from './analizer';
import appData from './app-data';
import Logger from './logger';
import { redditConfig } from './reddit-api';

const logger = new Logger('Main');

logger.info(`Started ${appData.name}/v${appData.version}`);

const args = process.argv.slice(2);

let userName = redditConfig.userName;

if (args.length > 0) {
  userName = args[0];
}

analizeUser(userName);
