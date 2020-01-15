const chai = require('chai');
const { assert, expect } = chai;
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const parser = require('../../src/metadata/parser');
const analyzer = require('../../src/metadata/analyzer');
const sources = require('../data/stories-of-analyzer-test-cases');
const userMessages = require('../../src/user-messages');

/**
 * In the analyzer tests we are using the react-framework-analyzer by default
 */
const DEFAULT_FRAMEWORK = 'react';

chai.use(deepEqualInAnyOrder);

describe('StoriesOf basic analyzer tests (framework agnostic)', function() {
  it('analyzer accepts null arg', function() {
    assert.ok(analyzer(null));
  });

  it('no dsm stories returns empty', function() {
    const WITHOUT_DSM = false;
    const testCase = sources.getSimpleStory(WITHOUT_DSM);
    runTest(testCase);
  });

  it('dsm stories returns story data', function() {
    const WITH_DSM = true;
    const testCase = sources.getSimpleStory(WITH_DSM);
    runTest(testCase);
  });

  it('Namespace StoriesOf - no dsm stories returns empty', function() {
    const WITHOUT_DSM = false;
    const testCase = sources.getSimpleStoryWithNamespaceStoriesOf(WITHOUT_DSM);
    runTest(testCase);
  });

  it('Namespace StoriesOf - dsm stories returns story data', function() {
    const WITH_DSM = true;
    const testCase = sources.getSimpleStoryWithNamespaceStoriesOf(WITH_DSM);
    runTest(testCase);
  });

  it('last story in storiesOf chain is dsm story', function() {
    const testCase = sources.getLastStoryIsDsmStory();
    runTest(testCase);
  });

  it('first story in storiesOf chain is dsm story', function() {
    const testCase = sources.getFirstStoryIsDsmStory();
    runTest(testCase);
  });

  it('Unsupported framework test', function() {
    const WITH_DSM = true;
    const testCase = sources.getSimpleStory(WITH_DSM);
    const ast = parser(testCase.storySource);
    assert.throws(() => {
      analyzer(ast, testCase.storySource, testCase.sourceFile, 'unsupportedFW');
    });
  });

  it('finds DSM story when named import storiesOf assigned to variable', function() {
    const testCase = sources.getStoryWithNamedStoriesOfAssignedToVariable();
    runTest(testCase);
  });

  it('finds DSM story when namespace import storybook.storiesOf assigned to variable', function() {
    const testCase = sources.getStoryWithNamespaceStoriesOfAssignedToVariable();
    runTest(testCase);
  });
});

describe('StoriesOf import declarations', function() {
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

describe('StoriesOf Fixed client issues - React', function() {
  it('story complex info object that we do not support, only extract in-dsm info', function() {
    const testCase = sources.getStoryWithComplexInfoProps();
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

function runTest(testCase) {
  const ast = parser(testCase.storySource);
  const result = analyzer(ast, testCase.storySource, testCase.sourceFile, DEFAULT_FRAMEWORK);
  expect(result).to.equalInAnyOrder(testCase.expected);
}
