const chai = require('chai');
const { assert, expect } = chai;
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const parser = require('../../src/metadata/parser');
const analyzer = require('../../src/metadata/analyzer');
const sources = require('../data/csf-analyzer-test-cases');
const userMessages = require('../../src/user-messages');
const { FileType } = require('../../src/metadata/utils/parser-constants');

/**
 * In the analyzer tests we are using the react-framework-analyzer by default
 */
const DEFAULT_FRAMEWORK = 'react';

chai.use(deepEqualInAnyOrder);

describe('CSF basic analyzer tests (framework agnostic)', function() {
  it('no dsm stories found - returns empty', function() {
    const testCase = sources.getSimpleStoryWithoutDsm();
    runTest(testCase);
  });

  it('found dsm stories -- returns story data', function() {
    const testCase = sources.getSimpleStoryWithDsm();
    runTest(testCase);
  });

  it('Unsupported framework test', function() {
    const testCase = sources.getSimpleStoryWithDsm();
    const ast = parser(testCase.storySource);
    assert.throws(() => {
      analyzer(ast, testCase.storySource, testCase.sourceFile, 'unsupportedFW');
    });
  });

  it(`Not supported 'in-dsm'`, function() {
    const testCase = sources.getSimpleStoryWithIncorrectInDsm();
    runTest(testCase);
  });
});

describe('CSF import declarations', function() {
  it('supports all import variations', function() {
    const testCase = sources.getStoryWithSupportedImportDeclarations();
    runTest(testCase);
  });

  it('parsing fails on unsupported import declarations', function() {
    const testCase = sources.getStoryWithInvalidImportDeclarations();
    assert.throws(() => {
      const ast = parser(testCase.storySource);
      analyzer(ast, testCase.storySource, testCase.sourceFile, DEFAULT_FRAMEWORK);
    });
  });
});

describe('CSF Fixed client issues - React', function() {
  it('story complex info object that we do not support, only extract in-dsm info', function() {
    const testCase = sources.getStoryWithComplexInfoProps();
    runTest(testCase);
  });

  it('story complex info object with unknown types inside in-dsm (array expressions)', function() {
    const testCase = sources.getStoryWithComplexInfoPropsInStory();
    runTest(testCase);
  });

  it('story complex info object that we do not support inside in-dsm.', function() {
    const testCase = sources.getStoryWithComplexInfoPropsInsideInDsm();
    assert.throws(() => {
      const ast = parser(testCase.storySource);
      analyzer(ast, testCase.storySource, testCase.sourceFile, DEFAULT_FRAMEWORK);
    }, userMessages.failedToParseInDsmInformation('someArray', 'ArrayExpression'));
  });
});

describe('CSF TypeScript Story', function() {
  it('parses TypeScript correctly and collects metadata', function() {
    const testCase = sources.getStoryWrittenInTypeScript();
    runTest(testCase, FileType.TYPESCRIPT);
  });
});

function runTest(testCase, type = FileType.JAVASCRIPT) {
  const ast = parser(testCase.storySource, type);
  const result = analyzer(ast, testCase.storySource, testCase.sourceFile, DEFAULT_FRAMEWORK);

  expect(result).to.equalInAnyOrder(testCase.expected);
}
