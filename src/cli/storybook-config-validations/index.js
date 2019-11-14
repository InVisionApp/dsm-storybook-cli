const { getConfigSourceCode } = require('./utils');
const { getStorybookConfigPath } = require('./get-storybook-config-path');
const parse = require('../../metadata/parser');
const runValidations = require('./run-validations');
const logger = require('../cli-logger');
const userMessages = require('../../user-messages');

function validateStorybookConfigJs(storybookVersion, customArgs) {
  const { storybookConfigPath, storybookConfigFolderPath } = getStorybookConfigPath(customArgs);
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

  runValidations(configAst, storybookConfigPath, storybookVersion);
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
