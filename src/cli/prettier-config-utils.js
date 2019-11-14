const logger = require('./cli-logger');
const path = require('path');
const forEach = require('lodash/forEach');
const isEmpty = require('lodash/isEmpty');
const userMessages = require('../user-messages');
const loadJsonConfigurationFromFile = require('./json-file-utils');

// we use cosmiconfig to load the configuration file
const PRETTIER_CONFIG_MODULE_NAME = 'prettier';
const PRETTIER_CONFIG_FILES = ['.prettierrc', '.prettierrc.json'];

function loadPrettierConfigFile(appPath, fileName) {
  const configFile = path.join(appPath, fileName);
  return loadJsonConfigurationFromFile(configFile, PRETTIER_CONFIG_MODULE_NAME);
}

function getPrettierConfiguration(appPath, appPackageJson) {
  // if there is prettier configuration in package json, use it
  let config = appPackageJson.prettier;

  if (isEmpty(config)) {
    // try to load from config file
    forEach(PRETTIER_CONFIG_FILES, (fileName) => {
      config = loadPrettierConfigFile(appPath, fileName);
      if (!isEmpty(config)) {
        return false;
      }
    });
  }

  logger.info(isEmpty(config) ? userMessages.prettierConfigNotFound() : userMessages.prettierConfigFound());

  return config;
}

module.exports = { getPrettierConfiguration };
