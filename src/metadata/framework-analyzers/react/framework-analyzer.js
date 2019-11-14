const t = require('@babel/types');
const { FrameworkAnalyzerError } = require('../framework-analyzer-errors');
const propExtractor = require('./prop-extractor');
const componentLocator = require('../../component-locator');
const { getComponentName } = require('../../utils/react/story-subject');
const { getStoryCodeNode, findReturnStatementNodesBySource } = require('../utils');
const userMessages = require('../../../user-messages');

function validateDsmInfo() {
  return [];
}

function extractMetadata(path, storyFileSource) {
  const returnStatement = getReturnStatementFromStorySource(path.node, storyFileSource);
  return { returnStatement };
}

function extractDocgenInfo({ path, storyFileSource, storyFilePath, dsmInfo }) {
  const returnStatement = getReturnStatementFromStorySource(path.node, storyFileSource);

  const componentName = getComponentName(returnStatement, dsmInfo);
  const componentFilename = componentLocator.resolveFromComponentName(componentName, dsmInfo, path, storyFilePath);

  return propExtractor.extract(componentFilename);
}

function getReturnStatementFromStorySource(node, fileSource) {
  const storyCodeNode = getStoryCodeNode(node);
  if (!t.isArrowFunctionExpression(storyCodeNode) && !t.isFunctionExpression(storyCodeNode)) {
    throw new FrameworkAnalyzerError(true, userMessages.invalidStory());
  }

  if (isImplicitReturn(storyCodeNode.body)) {
    return fileSource.substring(storyCodeNode.body.start, storyCodeNode.body.end);
  }

  return extractReturnStatement(storyCodeNode.body, fileSource);
}

/**
 * Given a storybook story function, return the code in the return statement.
 * Assume nothing about the structure of the story code and parse + traverse it in isolation to
 * verify correctness.
 * - multiple return values => throws
 * - no return values => throws
 * */
function extractReturnStatement(bodyNode, storyFileSource) {
  const storySource = storyFileSource.substring(bodyNode.start, bodyNode.end);
  const { returnStatements } = findReturnStatementNodesBySource(storySource);

  if (returnStatements.length !== 1) {
    throw new FrameworkAnalyzerError(true, userMessages.oneReturnStatementPerStory());
  }

  const returnBody = returnStatements[0].argument;
  return storySource.substring(returnBody.start, returnBody.end);
}

function isImplicitReturn(bodyNode) {
  return t.isJSXElement(bodyNode) || t.isJSXFragment(bodyNode);
}

module.exports = { extractMetadata, extractDocgenInfo, validateDsmInfo };
