import FS from 'fs';

type AppData = {
  /** The name of the app. */
  name: string;
  /** The description of the app. */
  description: string;
  /** The version number, e.g. '0.1.0'. */
  version: string;
};

const packageData = JSON.parse(FS.readFileSync('package.json', 'utf-8'));

const appData: AppData = {
  name: packageData.name,
  description: packageData.description,
  version: packageData.version,
};

export default appData;
