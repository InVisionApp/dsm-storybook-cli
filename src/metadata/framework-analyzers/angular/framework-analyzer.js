const t = require('@babel/types');
const { FrameworkAnalyzerError } = require('../framework-analyzer-errors');
const { findPropertyNodeByKey } = require('../../utils/ast-utils');
const { getStoryCodeNode, findReturnStatementNodesBySource } = require('../utils');
const componentLocator = require('../../component-locator');
const propExtractor = require('./prop-extractor');
const userMessages = require('../../../user-messages');

function validateDsmInfo(dsmInfo) {
  const errors = [];

  if (!dsmInfo.componentPath) {
    errors.push({ type: 'warning', message: userMessages.missingComponentPath() });
  }

  return errors;
}

function extractMetadata(path, storyFileSource) {
  return getTemplateInfoFromStorySource(path.node, storyFileSource);
}

function extractDocgenInfo({ storyFilePath, dsmInfo }) {
  let componentFilename;

  // trying to get the component path from dsmInfo
  componentFilename = componentLocator.resolveFromComponentPath(storyFilePath, dsmInfo.componentPath);

  if (!componentFilename) {
    return null;
  }

  return propExtractor.extract(componentFilename);
}

function getReturnedObjectFromStorySource(storyBodyNode, fileSource) {
  const storyCodeNode = getStoryCodeNode(storyBodyNode);
  if (!t.isArrowFunctionExpression(storyCodeNode) && !t.isFunctionExpression(storyCodeNode)) {
    throw new FrameworkAnalyzerError(true, userMessages.invalidStory());
  }

  let returnedObject = null;
  let parsedSourceCode = fileSource;
  const storyCodeBody = storyCodeNode.body;
  if (isImplicitReturn(storyCodeBody)) {
    returnedObject = storyCodeBody;
  } else {
    returnedObject = extractReturnedObject(storyCodeBody, fileSource);

    // in the case of explicit return, 'start' and 'end` values will be based on the start of the
    // story body (because we parse that code separately inside extractReturnedObject)
    // and not the start of the file
    parsedSourceCode = fileSource.substring(storyCodeBody.start, storyCodeBody.end);
  }
  return { returnedObject, parsedSourceCode };
}

function getTemplateInfoFromStorySource(node, fileSource) {
  const { returnedObject, parsedSourceCode } = getReturnedObjectFromStorySource(node, fileSource);
  const templateProperty = findPropertyNodeByKey(returnedObject, 'template');
  if (!templateProperty) {
    throw new FrameworkAnalyzerError(false, userMessages.noSampleCodeIfNoTemplate());
  }

  if (!t.isStringLiteral(templateProperty.value) && !t.isTemplateLiteral(templateProperty.value)) {
    throw new FrameworkAnalyzerError(true, userMessages.templateMustBeString());
  }

  let angularMetadata;

  if (t.isStringLiteral(templateProperty.value)) {
    angularMetadata = { storyTemplate: templateProperty.value.value };
  } else {
    // template literal
    // start is the index when the template starts with "`" so we remove it as we don't need it in the story template. (same for the end "`")
    angularMetadata = {
      storyTemplate: parsedSourceCode.substring(templateProperty.value.start + 1, templateProperty.value.end - 1)
    };
  }

  // check if we have a "props" property on the story returned object - take the value of "props" and add it as a string,
  // it will later be parsed on the server when generating sample code, where knobs are being processed
  const storyPropsProperty = findPropertyNodeByKey(returnedObject, 'props');
  if (storyPropsProperty) {
    angularMetadata.storyLevelProps = parsedSourceCode.substring(storyPropsProperty.value.start, storyPropsProperty.value.end);
  }

  return angularMetadata;
}

/**
 * Given a storybook story function, return the object in the return statement.
 * - multiple return values => throws
 * - no return values => throws
 * */
function extractReturnedObject(bodyNode, storyFileSource) {
  const storySource = storyFileSource.substring(bodyNode.start, bodyNode.end);
  const { returnStatements } = findReturnStatementNodesBySource(storySource);

  if (returnStatements.length !== 1) {
    throw new FrameworkAnalyzerError(true, userMessages.oneReturnStatementPerStory());
  }

  const returnBody = returnStatements[0].argument;

  if (!returnBody || !t.isObjectExpression(returnBody)) {
    throw new FrameworkAnalyzerError(true, userMessages.storyMustReturnObject());
  }

  return returnBody;
}

function isImplicitReturn(bodyNode) {
  return t.isObjectExpression(bodyNode);
}

module.exports = { extractMetadata, extractDocgenInfo, validateDsmInfo };
