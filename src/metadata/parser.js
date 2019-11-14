const prettier = require('prettier/parser-babylon');

module.exports = function parse(source, type = 'javascript') {
  const parser = getParser(type);
  return parser.parse(source);
};

function getParser(type) {
  if (type === 'javascript') {
    return prettier.parsers.babylon;
  }
  throw new Error(`Parser unsupported: "${type}"`);
}
