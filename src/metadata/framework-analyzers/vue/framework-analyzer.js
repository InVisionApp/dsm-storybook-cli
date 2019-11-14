const t = require('@babel/types');
const { FrameworkAnalyzerError } = require('../framework-analyzer-errors');
const { findPropertyNodeByKey } = require('../../utils/ast-utils');
const { getStoryCodeNode, findReturnStatementNodesBySource, findReturnStatementsNodesByAst } = require('../utils');
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
  if (!dsmInfo.componentPath) {
    return null;
  }
  const componentFilename = componentLocator.resolveFromComponentPath(storyFilePath, dsmInfo.componentPath);
  return propExtractor.extract(componentFilename);
}

function getTemplateInfoFromStorySource(node, fileSource) {
  const storyCodeNode = getStoryCodeNode(node);
  if (!t.isArrowFunctionExpression(storyCodeNode) && !t.isFunctionExpression(storyCodeNode)) {
    throw new FrameworkAnalyzerError(true, userMessages.invalidStory());
  }

  let returnedObject = null;
  let parsedSourceCode = fileSource;
  if (isImplicitReturn(storyCodeNode.body)) {
    returnedObject = storyCodeNode.body;
  } else {
    returnedObject = extractReturnedObject(storyCodeNode.body, fileSource);

    // in the case of explicit return, 'start' and 'end` values will be based on the start of the
    // story body (because we parse that code separately inside extractReturnedObject)
    // and not the start of the file
    parsedSourceCode = fileSource.substring(storyCodeNode.body.start, storyCodeNode.body.end);
  }

  const templateProperty = findPropertyNodeByKey(returnedObject, 'template');
  if (!templateProperty) {
    throw new FrameworkAnalyzerError(false, userMessages.noSampleCodeIfNoTemplate());
  }

  if (!t.isStringLiteral(templateProperty.value) && !t.isTemplateLiteral(templateProperty.value)) {
    throw new FrameworkAnalyzerError(true, userMessages.templateMustBeString());
  }

  let vueMetadata = {};

  if (t.isStringLiteral(templateProperty.value)) {
    vueMetadata = { storyTemplate: templateProperty.value.value };
  } else {
    // template literal
    // start is the index when the template starts with "`" so we remove it as we don't need it in the story template. (same for the end "`")
    vueMetadata = { storyTemplate: parsedSourceCode.substring(templateProperty.value.start + 1, templateProperty.value.end - 1) };
  }

  // check if we have a "props" property on the story returned object - take the value of "props" and add it as a string,
  // it will later be parsed on the server when generating sample code, where knobs are being processed
  const storyPropsProperty = findPropertyNodeByKey(returnedObject, 'props');
  if (storyPropsProperty) {
    vueMetadata.storyLevelProps = parsedSourceCode.substring(storyPropsProperty.value.start, storyPropsProperty.value.end);
  }

  return vueMetadata;
}

/**
 * Given a storybook story function, return the object in the return statement.
 * - multiple return values => throws (multiple return values that are not inside the return object of the explicit return statement)
 * - no return values => throws
 * */
function extractReturnedObject(bodyNode, storyFileSource) {
  const storySource = storyFileSource.substring(bodyNode.start, bodyNode.end);
  const { returnStatements: bodyReturnStatements, ast: bodyAst } = findReturnStatementNodesBySource(storySource);

  if (bodyReturnStatements.length === 0) {
    throw new FrameworkAnalyzerError(true, userMessages.oneReturnStatementPerStory());
  }

  let returnBody;
  // only 1 return statement in the entire story
  if (bodyReturnStatements.length === 1) {
    returnBody = bodyReturnStatements[0].argument;
  } else {
    const topLevelReturnStatements = getTopLevelReturnStatements(bodyAst);

    // check if in the top level of the ast there is only 1 return statement
    if (topLevelReturnStatements.length !== 1) {
      throw new FrameworkAnalyzerError(true, userMessages.oneReturnStatementPerStory());
    }

    // only 1 return statement in the top level of the story
    const returnStatement = topLevelReturnStatements[0];

    returnBody = returnStatement.node.argument;

    // removing the top level return statement from the body ast so we could calculate how many return statements
    // there are without the content of the top level return statement node since we know that in the entire body
    // there are more than 1 return statements we need to make sure they are all within the single top level
    // return statement body, otherwise we can't know which return statement to choose
    bodyAst.program.body[0].body.splice(returnStatement.index, 1);
    const { returnStatements: returnStatementsWithoutTopLevelReturnStatement } = findReturnStatementsNodesByAst(bodyAst);

    if (returnStatementsWithoutTopLevelReturnStatement.length !== 0) {
      throw new FrameworkAnalyzerError(true, userMessages.oneReturnStatementPerStory());
    }
  }

  if (!returnBody || !t.isObjectExpression(returnBody)) {
    throw new FrameworkAnalyzerError(true, userMessages.storyMustReturnObject());
  }

  return returnBody;
}

function getTopLevelReturnStatements(ast) {
  return ast.program.body[0].body.reduce((acc, node, index) => {
    t.isReturnStatement(node) && acc.push({ node, index });
    return acc;
  }, []);
}

function isImplicitReturn(bodyNode) {
  return t.isObjectExpression(bodyNode);
}

module.exports = { extractMetadata, extractDocgenInfo, validateDsmInfo };
