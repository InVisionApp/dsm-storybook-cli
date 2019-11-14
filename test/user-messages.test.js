const chai = require('chai');
const { assert } = chai;
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const get = require('lodash/get');
const forEach = require('lodash/forEach');
const endsWith = require('lodash/endsWith');
const parseFile = require('../src/metadata/parser');

let files = [];
const EXCLUDED_FILES = ['runner.js'];

describe('error-messages', function() {
  beforeAll(() => {
    files = getSourceFiles();
  });

  it('source files found', function() {
    assert.isNotEmpty(files);
  });

  it('no literal string message in logger', function() {
    forEach(files, (file) => {
      if (isExcludedFile(file)) {
        return;
      }
      const src = getSource(file);
      const ast = parseFile(src);
      const result = analyze(ast);
      let errorDetails = [];
      if (result.errors.length > 0) {
        errorDetails = result.errors.reduce((acc, err) => {
          acc.push({ file: file, failedOnCall: src.substring(err.start, err.end) });
          return acc;
        }, []);
      }
      assert.isEmpty(errorDetails);
    });
  });
});

function getSourceFiles() {
  const cliPath = path.resolve('./src/cli');
  return glob.sync(`${cliPath}/**/*.js`);
}

function getSource(path) {
  try {
    return fs.readFileSync(path, 'utf8');
  } catch (e) {
    return null;
  }
}

function analyze(ast) {
  let loggerName;
  let userMessagesName;
  const errors = [];
  traverse(ast, {
    Program(path) {
      loggerName = getModuleVariableName(path.node, 'cli-logger');
      userMessagesName = getModuleVariableName(path.node, 'user-messages');
    },
    CallExpression(path) {
      const node = path.node;
      if (!loggerName) {
        return;
      }
      // is this a call to a method on the "logger" object?
      if (node.callee.object && node.callee.object.name === loggerName) {
        if (t.isIdentifier(node.arguments[0])) {
          // we went out of our way to pass a variable to the logger, let it pass :(
          return;
        }

        if (t.isConditionalExpression(node.arguments[0])) {
          // check if both options print messages
          const leftArgumentName = get(node, 'arguments[0].consequent.callee.object.name');
          const rightArgumentName = get(node, 'arguments[0].alternate.callee.object.name');
          if (leftArgumentName !== userMessagesName || rightArgumentName !== userMessagesName) {
            errors.push(node);
            return false;
          }
          return;
        }

        const firstArgumentName = get(node, 'arguments[0].callee.object.name');
        if (firstArgumentName !== userMessagesName) {
          errors.push(node);
          return false;
        }
      }
    }
  });
  return { errors };
}

function getModuleVariableName(node, moduleName) {
  let loggerName = undefined;
  forEach(node.body, (bodyNode) => {
    if (!isRequireDeclaration(bodyNode)) {
      return;
    }

    forEach(bodyNode.declarations, (declarator) => {
      const module = get(declarator, 'init.arguments[0]');
      if (module && module.value.indexOf(moduleName) > 0) {
        loggerName = declarator.id.name;
        return false;
      }
    });
  });
  return loggerName;
}

function isRequireDeclaration(node) {
  return (
    t.isVariableDeclaration(node) &&
    t.isCallExpression(get(node, 'declarations[0].init')) &&
    node.declarations[0].init.callee.name === 'require'
  );
}

function isExcludedFile(file) {
  return EXCLUDED_FILES.some((excluded) => {
    return endsWith(file, excluded);
  });
}
