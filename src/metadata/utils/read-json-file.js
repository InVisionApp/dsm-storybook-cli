const fs = require('fs-extra');
const path = require('path');

const readJsonFileFromPath = (storyFilePath, filePath) => {
  // path is relative to story file
  const resolvedFilePath = path.resolve(path.parse(storyFilePath).dir, filePath);
  const jsonFile = fs.readJsonSync(resolvedFilePath, { throws: false });

  return { file: jsonFile, filePath: resolvedFilePath };
};

module.exports = { readJsonFileFromPath };
