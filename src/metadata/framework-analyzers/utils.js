const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const parse = require('../parser');
const { isFunction } = require('../utils/ast-utils');

/**
 * Extracts the story function from ".add('storyName', storyFunc, [options])".
 *    Note that storyFunc can be a chain of (composed) functions -
 *    ".add('default', withInfo()(() => <DateRangePickerWrapper autoFocus />),{}"
 * */
const getStoryCodeNode = (node) => {
  // in case the node is already the render function - in CSF
  if (isFunction(node)) {
    return node;
  }

  if (!t.isCallExpression(node)) {
    return null;
  }

  for (let i = 0; i < node.arguments.length; i++) {
    let argument = node.arguments[i];
    if (isFunction(argument)) {
      return argument;
    }
    if (t.isCallExpression(argument)) {
      return getStoryCodeNode(argument);
    }
  }
};

/**
 * Parses & traverses the source code to find all return statements
 * @param sourceCode as string
 * @return {{returnStatements: Array, ast: Object}} an object with all detected return statements and the generated AST
 */
const findReturnStatementNodesBySource = (sourceCode) => {
  const ast = parse(sourceCode);

  return findReturnStatementsNodesByAst(ast);
};

const findReturnStatementsNodesByAst = (ast) => {
  const returnStatements = [];
  traverse(ast, {
    ReturnStatement(path) {
      returnStatements.push(path.node);
    }
  });

  return { returnStatements, ast };
};

module.exports = {
  getStoryCodeNode,
  findReturnStatementNodesBySource,
  findReturnStatementsNodesByAst
};
