const path = require('path');
const fs = require('fs-extra');
const { forEach } = require('lodash');
const { configurationFileNames } = require('./is-using-declarative-configuration');

const DEFAULT_STORYBOOK_CONFIG_FOLDER_PATH = './.storybook';
const STORYBOOK_CONFIG_LOCATION_ARGS = ['-c', '--config-dir'];
const EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx'];
const POSSIBLE_CONFIG_NAMES = Object.values(configurationFileNames);

/**
 * Resolves the storybook config file path, return null if not found
 **/
function getStorybookConfigPath(customArgs) {
  const splittedArgs = customArgs.split(' ');
  const argIndex = splittedArgs.findIndex((arg) => STORYBOOK_CONFIG_LOCATION_ARGS.includes(arg));

  const isCustomFileLocation = argIndex !== -1;
  const configFolderPath = isCustomFileLocation ? splittedArgs[argIndex + 1] : DEFAULT_STORYBOOK_CONFIG_FOLDER_PATH;
  let resolvedConfigPath = null;

  forEach(EXTENSIONS, (extension) => {
    forEach(POSSIBLE_CONFIG_NAMES, (configName) => {
      const configFilePath = path.resolve(configFolderPath, `${configName}${extension}`);
      if (fs.existsSync(configFilePath)) {
        resolvedConfigPath = configFilePath;
        return false;
      }
    });
  });

  return { storybookConfigPath: resolvedConfigPath, storybookConfigFolderPath: configFolderPath };
}

module.exports = { getStorybookConfigPath };
