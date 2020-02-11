const { FileType } = require('./parser-constants');

const FILE_EXTENSIONS_TO_TYPE = {
  js: FileType.JAVASCRIPT,
  jsx: FileType.JAVASCRIPT,
  ts: FileType.TYPESCRIPT,
  tsx: FileType.TYPESCRIPT
};

function getFileExtension(path) {
  return path.split('.').pop();
}

module.exports = function getParserType(path) {
  const fileExtension = getFileExtension(path);
  return FILE_EXTENSIONS_TO_TYPE[fileExtension];
};
