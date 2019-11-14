const path = require('path');
const fs = require('fs-extra');
const { forEach } = require('lodash');

const DEFAULT_STORYBOOK_CONFIG_FOLDER_PATH = './.storybook';
const STORYBOOK_CONFIG_LOCATION_ARGS = ['-c', '--config-dir'];
const EXTENSIONS = ['.js', '.ts'];

/**
 * Resolves the storybook config file path, return null if not found
 **/
function getStorybookConfigPath(customArgs) {
  const splittedArgs = customArgs.split(' ');
  const argIndex = splittedArgs.findIndex((arg) => STORYBOOK_CONFIG_LOCATION_ARGS.includes(arg));

  let configFolderPath = DEFAULT_STORYBOOK_CONFIG_FOLDER_PATH;
  if (argIndex !== -1) {
    configFolderPath = splittedArgs[argIndex + 1];
  }

  let resolvedConfigPath = null;
  forEach(EXTENSIONS, (extension) => {
    const configFilePath = path.resolve(configFolderPath, `config${extension}`);
    if (fs.existsSync(configFilePath)) {
      resolvedConfigPath = configFilePath;
      return false;
    }
  });

  return { storybookConfigPath: resolvedConfigPath, storybookConfigFolderPath: configFolderPath };
}

module.exports = { getStorybookConfigPath };
