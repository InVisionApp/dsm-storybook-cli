const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const getFrameworkAnalyzer = require('../framework-analyzers').getFrameworkAnalyzer;
const resolveDsmInfo = require('../resolve-dsm-info');
const validateDsmInfo = require('../validate-dsm-info');
const {
  getDsmInfo,
  extractMetadata,
  extractDocgenInfo,
  addImportDeclaration,
  addRequireDeclaration
} = require('./analyzer-utils');

const ADD_STORY_METHOD_NAME = 'add';
const STORIES_FIXTURE_METHOD_NAME = 'storiesOf';

/**
 * Analyzer that analysis Storybook '.stories' files that are structured with the 'StoriesOf' format
 **/
function analyze(ast, storyFileSource, storyFilePath, framework) {
  const dsmStoriesData = [];
  const importDeclarations = [];

  // If we find a storiesOf assigned to a variable, we need to capture it. We store the name of the variable and map it
  // to the storiesOf node in the AST. Later, we encounter `.add(...)` and need to find the name of the variable used at
  // the beginning of the chain, if it exists. If we find a variable (instead of storiesOf), we reference this mapping
  // and return the storiesOf node assigned to the variable.
  const storiesOfVariableMap = {};

  traverse(ast, {
    VariableDeclarator(path) {
      const storiesOfAssignmentMapping = extractStoriesOfAssignment(path);

      if (storiesOfAssignmentMapping) {
        const { name, node } = storiesOfAssignmentMapping;
        storiesOfVariableMap[name] = node;
      }

      // detect "require(...)"
      addRequireDeclaration(path, importDeclarations);
    },
    CallExpression(path) {
      const story = extractDsmStoryData(path, storyFileSource, storyFilePath, framework, storiesOfVariableMap);
      if (story) {
        dsmStoriesData.push(story);
      }
    },
    ImportDeclaration(path) {
      addImportDeclaration(path, importDeclarations);
    }
  });

  return { importDeclarations, dsmStoriesData };
}

/**
 * const story = storiesOf(...)
 * story.add(...)
 *
 * If users assign storiesOf(...) to a variable, we need to capture that variable assignment and storiesOf node so we
 * can analyze it in `extractDsmStoryData`.
 *
 * We need to account for both named imports and namespace imports of `storiesOf`.
 */
function extractStoriesOfAssignment(path) {
  const { node, scope } = path;
  const isStoriesOfAssignment = isDirectStoriesOfUsage(node.init, scope);

  if (isStoriesOfAssignment) {
    // Get the name of the variable, and the storyOf node
    const variableName = node.id.name;
    const storiesOfNode = node.init;

    return {
      name: variableName,
      node: storiesOfNode
    };
  }

  return null;
}

function extractDsmStoryData(path, storyFileSource, storyFilePath, framework, storiesOfVariableMap) {
  // we're only working on ".add(...)"
  if (!t.isMemberExpression(path.node.callee)) {
    return;
  }

  // Only search for story data if we are at the `add(...)` function in the AST
  if (path.node.callee.property.name !== ADD_STORY_METHOD_NAME) {
    return;
  }

  const storiesOf = findStoriesOf(path.node, path.scope, storiesOfVariableMap);
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

/**
 * Search for the storiesOf node recursively through the tree, starting at the `... .add()` tree.
 */
function findStoriesOf(node, scope, storiesOfVariableMap) {
  if (isVariableStoriesOfUsage(node, storiesOfVariableMap)) {
    return storiesOfVariableMap[node.name];
  } else if (isDirectStoriesOfUsage(node, scope)) {
    return node;
  } else if (t.isCallExpression(node)) {
    return findStoriesOf(node.callee, scope, storiesOfVariableMap);
  } else if (t.isMemberExpression(node)) {
    return findStoriesOf(node.object, scope, storiesOfVariableMap);
  } else {
    return null;
  }
}

function isVariableStoriesOfUsage(node, storiesOfVariableMap) {
  return t.isIdentifier(node) && storiesOfVariableMap[node.name];
}

function isDirectStoriesOfUsage(node, scope) {
  return t.isCallExpression(node) && isCalleeStoriesOf(node.callee, scope);
}

function isCalleeStoriesOf(node, scope) {
  return isNamedImportStoriesOfUsage(node) || isNamespaceImportStoriesOfUsage(node, scope);
}

/**
 * `import { storiesOf } from '@storybook/react'`
 * ...
 * storiesOf(...)
 */
function isNamedImportStoriesOfUsage(node) {
  return t.isIdentifier(node) && node.name === STORIES_FIXTURE_METHOD_NAME;
}

/**
 * `import * as storybook from '@storybook/react'`
 * ...
 * storybook.storiesOf(...)
 */
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
