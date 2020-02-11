const babylon = require('prettier/parser-babylon');
const typescript = require('prettier/parser-typescript');
const toBabelAst = require('estree-to-babel');
const { FileType } = require('./utils/parser-constants');
const traverse = require('@babel/traverse').default;

module.exports = function parse(source, type = FileType.JAVASCRIPT) {
  const parser = getParser(type);
  const ast = parser.parse(source);

  // Babel AST has some deviations from the structure of estree
  // (deviations list: https://babeljs.io/docs/en/babel-parser#output)
  // so we transform the estree AST we get from the TypeScript parser
  // to a babel AST using the `estree-to-babel` package.
  if (type === FileType.TYPESCRIPT) {
    return buildTypeScriptAst(ast);
  }

  return ast;
};

function buildTypeScriptAst(ast) {
  const newAst = toBabelAst(ast);

  // `estree-babel` doesn't add the `start` & `end` properties to
  // the root of the node object so we extract them from the `range`
  // property (`[start, end]`)
  traverse(newAst, {
    enter(path) {
      path.node.start = path.node.range[0];
      path.node.end = path.node.range[1];
    }
  });

  return newAst;
}

function getParser(type) {
  switch (type) {
    case FileType.JAVASCRIPT:
      return babylon.parsers.babylon;
    case FileType.TYPESCRIPT:
      return typescript.parsers.typescript;
    default:
      throw new Error(`Parser unsupported: "${type}"`);
  }
}
