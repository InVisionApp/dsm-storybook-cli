const fs = require('fs');
const logger = require('../cli-logger');
const userMessages = require('../../user-messages');
const traverse = require('@babel/traverse').default;

function getConfigSourceCode(path) {
  try {
    return fs.readFileSync(path, 'utf8');
  } catch (e) {
    logger.error(userMessages.failedToReadStorybookConfigFile(path), e);
    return null;
  }
}

function getCallExpressionsToValidate(ast, callExpressionName) {
  const callExpressions = [];

  traverse(ast, {
    CallExpression(path) {
      if (path.node.callee.name === callExpressionName) {
        callExpressions.push(path.node);
      }
    }
  });

  return callExpressions;
}

module.exports = { getConfigSourceCode, getCallExpressionsToValidate };
