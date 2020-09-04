const { getConfigSourceCode } = require('./utils');
const parse = require('../../metadata/parser');
const runValidations = require('./run-validations');
const logger = require('../cli-logger');
const userMessages = require('../../user-messages');

function validateStorybookConfigJs(storybookOptions) {
  const { storybookConfigPath, storybookConfigFolderPath, storybookVersion, isUsingDeclarativeConfiguration } = storybookOptions;
  if (!storybookConfigPath) {
    logger.error(userMessages.failedToReadStorybookConfigFile(storybookConfigFolderPath));
    return;
  }

  const configSourceCode = getConfigSourceCode(storybookConfigPath);
  if (!configSourceCode) {
    return;
  }

  const configAst = parseConfigSourceCode(configSourceCode);
  if (!configAst) {
    return;
  }

  runValidations({ configAst, configPath: storybookConfigPath, storybookVersion, isUsingDeclarativeConfiguration });
}

function parseConfigSourceCode(configSourceCode) {
  try {
    return parse(configSourceCode);
  } catch (e) {
    logger.error(userMessages.failedToParseStorybookConfigFile(), e);
    return null;
  }
}

module.exports = { validateStorybookConfigJs };
