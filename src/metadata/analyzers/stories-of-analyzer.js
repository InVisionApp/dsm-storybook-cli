const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const STORIES_FIXTURE_METHOD_NAME = 'storiesOf';
const getFrameworkAnalyzer = require('../framework-analyzers').getFrameworkAnalyzer;
const resolveDsmInfo = require('../resolve-dsm-info');
const validateDsmInfo = require('../validate-dsm-info');
const ADD_STORY_METHOD_NAME = 'add';
const {
  getDsmInfo,
  extractMetadata,
  extractDocgenInfo,
  addImportDeclaration,
  addRequireDeclaration
} = require('./analyzer-utils');

/**
 * Analyzer that analysis Storybook '.stories' files that are structured with the 'StoriesOf' format
 **/
function analyze(ast, storyFileSource, storyFilePath, framework) {
  const dsmStoriesData = [];
  const importDeclarations = [];
  traverse(ast, {
    CallExpression(path) {
      const story = extractDsmStoryData(path, storyFileSource, storyFilePath, framework);
      if (story) {
        dsmStoriesData.push(story);
      }
    },
    ImportDeclaration(path) {
      addImportDeclaration(path, importDeclarations);
    },
    // detect "require(...)"
    VariableDeclarator(path) {
      addRequireDeclaration(path, importDeclarations);
    }
  });

  return { importDeclarations, dsmStoriesData };
}

function extractDsmStoryData(path, storyFileSource, storyFilePath, framework) {
  // we're only working on ".add(...)"
  if (!t.isMemberExpression(path.node.callee)) {
    return;
  }

  if (path.node.callee.property.name !== ADD_STORY_METHOD_NAME) {
    return;
  }

  const storiesOf = findStoriesOf(path.node, path.scope);
  if (!storiesOf) {
    // encountered a "add()" method call, but it wasn't part of the storiesOf().add chain
    return;
  }

  const kind = getKind(storiesOf);
  if (!kind) {
    return;
  }

  const storyName = getStoryName(path.node);
  if (!storyName) {
    return;
  }

  const dsmInfo = getDsmInfo(getArgumentValue(path.node, 2));
  if (!dsmInfo) {
    return;
  }

  const frameworkAnalyzer = getFrameworkAnalyzer(framework);
  const validationResult = validateDsmInfo(dsmInfo, storyName, kind, frameworkAnalyzer.validateDsmInfo);
  if (!validationResult.isValid) {
    return;
  }

  const storyData = {
    externalComponentId: dsmInfo.id,
    kind: kind,
    name: storyName,
    dsmInfo: resolveDsmInfo(dsmInfo, storyFilePath)
  };

  extractMetadata(storyData, frameworkAnalyzer, path, storyFilePath, storyFileSource, storyName, kind);
  extractDocgenInfo(storyData, frameworkAnalyzer, path, storyFilePath, storyFileSource, storyName, kind, dsmInfo);

  return storyData;
}

function getKind(node) {
  if (t.isCallExpression(node) && node.arguments.length > 0 && t.isStringLiteral(node.arguments[0])) {
    return node.arguments[0].value;
  }

  // TODO - warn failed to extract kind - in verbose.
  return null;
}

function findStoriesOf(node, scope) {
  if (t.isCallExpression(node) && isCalleeStoriesOf(node.callee, scope)) {
    return node;
  } else if (t.isCallExpression(node)) {
    return findStoriesOf(node.callee, scope);
  } else if (t.isMemberExpression(node)) {
    return findStoriesOf(node.object, scope);
  } else {
    return null;
  }
}

function isCalleeStoriesOf(node, scope) {
  return isNamedImportStoriesOfUsage(node) || isNamespaceImportStoriesOfUsage(node, scope);
}

// `import { storiesOf } from '@storybook/react'`
// ...
// storiesOf(...)
function isNamedImportStoriesOfUsage(node) {
  return t.isIdentifier(node) && node.name === STORIES_FIXTURE_METHOD_NAME;
}

// `import * as storybook from '@storybook/react'`
// ...
// storybook.storiesOf(...)
function isNamespaceImportStoriesOfUsage(node, scope) {
  return (
    t.isMemberExpression(node) &&
    t.isIdentifier(node.object) &&
    scope.bindings[node.object.name] && // Making sure the variable is imported and not just a declaration
    t.isIdentifier(node.property) &&
    node.property.name === STORIES_FIXTURE_METHOD_NAME
  );
}

function getStoryName(node) {
  return getArgumentValue(node, 0);
}

function getArgumentValue(node, index) {
  if (t.isCallExpression(node) && node.arguments.length > index) {
    const argument = node.arguments[index];
    return t.isLiteral(argument) ? argument.value : argument;
  }
  return null;
}

module.exports = { analyze };
