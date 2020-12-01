# Contributing

## Local Setup

### Prerequisites

You will need:

- [node.js](https://nodejs.org/en/download/) >= `0.1.0`
- [yarn](https://yarnpkg.com/getting-started/install/) >= `1.22.5`
- [Visual Studio Code](https://code.visualstudio.com/Download) (You may also use other editors, but everything is already configured for this one)

### Installation

First, clone the project from GitHub:

- Using HTTPS:

  ```
  git clone https://github.com/TimJentzsch/tor-user-stats.git
  ```

- Using SSH:

  ```
  git clone git@github.com:TimJentzsch/tor-user-stats.git
  ```

Don't forget to navigate to the folder:

```
cd tor-user-stats
```

Now you can install the dependencies:

```
yarn install
```

### Configuration

The project needs to interact with the reddit API. Therefore, you have to create a reddit application.

1. Navigate to the [reddit app settings](https://www.reddit.com/prefs/apps).
2. Make sure that you have read the [API usage guidelines](https://www.reddit.com/wiki/api).
3. Create a new application. Give it a meaningful name and choose "installed app" as type.
4. You will need the ID of the app that you have created. It will be displayed right under "installed app".
5. Read and fill out the [API registration form](https://docs.google.com/a/reddit.com/forms/d/1ao_gme8e_xfZ41q4QymFqg5HD29HggOD8I9-MFTG7So/viewform).
6. In the project files, navigate to `config/` and copy the contents of `reddit.example.config.json` to a new file named `reddit.config.json`.
7. Insert the above mentioned client ID and your user name in the appropriate properties.

### Usage

You should now be able to start the app via `yarn start`. This will run the analysis for the user specified in the `reddit.config.json`.

To run the analysis for a specific user, use:

```
yarn start <username>
```
