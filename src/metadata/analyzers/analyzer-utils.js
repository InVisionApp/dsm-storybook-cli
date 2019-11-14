const t = require('@babel/types');
const { get } = require('lodash');
const logger = require('../../cli/cli-logger');
const { objectExpressionToJsObject, findPropertyNodeByKey } = require('../utils/ast-utils');

const formatErrorMessage = (errorMessage, kind, storyName) =>
  `${errorMessage} (detected in ${storyName ? `story "${storyName}" of ${kind}` : `${kind}`})`;

/**
 * Runs the framework specific metadata extraction function
 **/
function extractMetadata(storyData, frameworkAnalyzer, path, storyFilePath, storyFileSource, storyName, kind) {
  try {
    storyData.frameworkMetadata = frameworkAnalyzer.extractMetadata(path, storyFileSource);
  } catch (e) {
    reportError(e, storyName, kind, { storyFilePath, storyFileSource, storyMetadata: storyData });
    // this means the story can still render in DSM but it will not show the sample code section
    storyData.frameworkMetadata = null;
  }
}

/**
 * Runs the framework specific docgen extraction function
 **/
function extractDocgenInfo(storyData, frameworkAnalyzer, path, storyFilePath, storyFileSource, storyName, kind, dsmInfo) {
  try {
    storyData.dsmInfo.docgenInfo = frameworkAnalyzer.extractDocgenInfo({ path, storyFileSource, storyFilePath, dsmInfo });
  } catch (e) {
    reportError(e, storyName, kind, { storyFilePath, storySourceCode: storyFileSource, storyMetadata: storyData });
    // this means the story can still render in DSM but it will not show the props table and description
    storyData.dsmInfo.docgenInfo = null;
  }
}

function reportError(error, storyName, kind, { storyFilePath, storySourceCode, storyMetadata }) {
  const textToLog = formatErrorMessage(error.message, kind, storyName);

  // in case this is an unexpected error or an error we consider fatal, use error level
  if (error.name !== 'FrameworkAnalyzerError' || error.isFatal) {
    logger.error(textToLog, null, { storyFilePath, storySourceCode, storyMetadata });
  } else {
    logger.warning(textToLog);
  }
}

/**
 * Extract the dsm information ('in-dsm') from the object provided.
 * 'in-dsm' can be as a property on the top level of the object or inside a property that is provided with 'parentPropertyKey' option
 **/
function getDsmInfo(infoObject, options = { parentPropertyKey: null }) {
  const { parentPropertyKey } = options;
  if (!t.isObjectExpression(infoObject)) {
    return null;
  }

  let parentNode = infoObject;
  if (parentPropertyKey) {
    const parentPropertyNode = findPropertyNodeByKey(infoObject, parentPropertyKey);
    parentNode = parentPropertyNode && parentPropertyNode.value;
  }

  if (!parentNode) {
    return null;
  }

  let inDsmNode = findPropertyNodeByKey(parentNode, 'in-dsm');
  if (!inDsmNode) {
    return null;
  }

  const inDsmJsObject = objectExpressionToJsObject({ properties: [inDsmNode] });
  return inDsmJsObject['in-dsm'];
}

function addImportDeclaration(path, importDeclarations) {
  const node = path.node;
  const importDeclaration = createImportDeclaration(node.source.value);
  importDeclarations.push(importDeclaration);

  node.specifiers.forEach((specifier) => {
    if (t.isImportSpecifier(specifier)) {
      // import { foo } from 'foo';
      importDeclaration.bindings.push(specifier.imported.name);
    } else if (t.isImportDefaultSpecifier(specifier) || t.isImportNamespaceSpecifier(specifier)) {
      // DefaultSpecifier   - import baz from 'foo';
      // NamespaceSpecifier - import * as baz from 'foo';
      importDeclaration.bindings.push(specifier.local.name);
    }
  });
}

function addRequireDeclaration(path, importDeclarations) {
  const declarator = path.node;
  if (isRequire(declarator)) {
    const importFrom = get(declarator, 'init.arguments[0].value');
    if (!importFrom) {
      return;
    }
    const importDeclaration = createImportDeclaration(importFrom);
    importDeclarations.push(importDeclaration);

    // detect named exports "const { dummy } = require('...')"
    if (t.isObjectPattern(declarator.id)) {
      declarator.id.properties.forEach((prop) => {
        importDeclaration.bindings.push(prop.value.name);
      });
    } else if (t.isIdentifier(declarator.id)) {
      importDeclaration.bindings.push(declarator.id.name);
    }
  }
}

function createImportDeclaration(moduleName) {
  return { moduleName, bindings: [] };
}

function isRequire(declarator) {
  return (
    t.isCallExpression(declarator.init) && t.isIdentifier(declarator.init.callee) && declarator.init.callee.name === 'require'
  );
}

module.exports = {
  extractMetadata,
  extractDocgenInfo,
  getDsmInfo,
  addImportDeclaration,
  addRequireDeclaration,
  formatErrorMessage
};
