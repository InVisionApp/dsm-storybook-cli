const userMessages = require('../user-messages');
const logger = require('../cli/cli-logger');
const { readJsonFileFromPath } = require('./utils/read-json-file');

module.exports = function(dsmInfo, storyFilePath) {
  if (!dsmInfo.versionFilePath) {
    return dsmInfo;
  }

  const { file: versionFileObject, filePath: versionFilePath } = readJsonFileFromPath(storyFilePath, dsmInfo.versionFilePath);

  if (versionFileObject) {
    if (versionFileObject.version) {
      dsmInfo.version = versionFileObject.version;
    } else {
      logger.warning(userMessages.missingKeyInVersionFromFile(versionFilePath));
    }
  } else {
    if (dsmInfo.version) {
      logger.warning(userMessages.failedWithFallbackVersionFromFile(versionFilePath));
    } else {
      logger.warning(userMessages.failedVersionFromFile(versionFilePath));
    }
  }

  return dsmInfo;
};
