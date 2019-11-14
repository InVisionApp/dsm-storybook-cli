const fs = require('fs');
const path = require('path');
const reject = require('lodash/reject');
const glob = require('glob');
const { STORYBOOK_BUILD_FOLDER } = require('../constants');

function getAssetFiles(outputDir) {
  const assetRootDir = `${outputDir}/${STORYBOOK_BUILD_FOLDER}`;

  const assetFileNames = reject(glob.sync(`${assetRootDir}/**/*`), (fileName) => {
    // exclude source maps and directories
    return /.map$/.test(fileName) || fs.lstatSync(fileName).isDirectory();
  });

  const prefixLength = assetRootDir.length + 1;
  return assetFileNames.map((fileName) => {
    return {
      fileName: fileName.substring(prefixLength),
      resolvedPath: path.resolve(fileName)
    };
  });
}

module.exports = getAssetFiles;
