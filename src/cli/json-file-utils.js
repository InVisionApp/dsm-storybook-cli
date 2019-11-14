const fs = require('fs-extra');
const cosmiconfig = require('cosmiconfig');

const EMPTY_CONFIG = {};

function loadJsonConfigurationFromFile(configFilePath, moduleName) {
  if (!fs.existsSync(configFilePath)) {
    return EMPTY_CONFIG;
  }

  const explorer = cosmiconfig(moduleName, {
    // override the default yaml loader for files with no extension
    loaders: { noExt: cosmiconfig.loadJson }
  });

  const configuration = explorer.loadSync(configFilePath);
  if (!configuration || !configuration.config || configuration.isEmpty) {
    return EMPTY_CONFIG;
  }
  return configuration.config;
}

module.exports = loadJsonConfigurationFromFile;
