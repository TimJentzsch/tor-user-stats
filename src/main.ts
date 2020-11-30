import analizeUser from './analizer';
import appData from './app-data';
import Logger from './logger';
import { redditConfig } from './reddit-api';

const logger = new Logger('Main');

logger.info(`Started ${appData.name}/v${appData.version}`);
analizeUser(redditConfig.userName);
