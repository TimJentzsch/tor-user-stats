import packageData from '../package.json';

type AppData = {
  /** The name of the app. */
  name: string;
  /** The description of the app. */
  description: string;
  /** The version number, e.g. '0.1.0'. */
  version: string;
};

const appData: AppData = {
  name: packageData.name,
  description: packageData.description,
  version: packageData.version,
};

export default appData;
