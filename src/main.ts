import Logger from './logger';

export default function helloWorld(): string {
  return 'Hello World!';
}

const logger = new Logger('Main');
logger.info(helloWorld());
