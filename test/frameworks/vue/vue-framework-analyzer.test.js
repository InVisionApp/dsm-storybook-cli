const traverse = require('@babel/traverse').default;
const { assert } = require('chai');
const parser = require('../../../src/metadata/parser');
const userMessages = require('../../../src/user-messages');
const getFrameworkAnalyzer = require('../../../src/metadata/framework-analyzers').getFrameworkAnalyzer;
const sources = require('./data/vue-framework-analyzer-test-cases');
const vueFrameworkAnalyzer = getFrameworkAnalyzer('vue');

const simulateCallByAnalyzer = (source) => {
  const ast = parser(source);
  let result = {};

  traverse(ast, {
    CallExpression(path) {
      result = vueFrameworkAnalyzer.extractMetadata(path, source);
      path.stop();
    }
  });

  return result;
};

describe('Extracting Vue metadata (storyTemplate, storyLevelProps)', function() {
  it('arrow func with explicit object return extracts template', function() {
    const result = simulateCallByAnalyzer(sources.getStoryWithArrowExplicitReturn());
    assert.equal(result.storyTemplate, '<my-button prefix=">>">click me</my-button>');
  });

  it('arrow func with implicit object return extracts template', function() {
    const result = simulateCallByAnalyzer(sources.getStoryWithArrowImplicitReturn());
    assert.equal(result.storyTemplate, '<my-button prefix=">>">click me</my-button>');
  });

  it('function with explicit object return extracts template', function() {
    const result = simulateCallByAnalyzer(sources.getStoryWithFunctionExplicitReturn());
    assert.equal(result.storyTemplate, '<my-button prefix=">>">click me</my-button>');
  });

  it('story with props - implicit return', function() {
    const result = simulateCallByAnalyzer(sources.getStoryWithPropsImplicitReturn());
    assert.equal(result.storyTemplate, '<my-button prefix=">>">click me</my-button>');
    assert.equal(result.storyLevelProps, "{ textKnob: { default: text('title', 'Hello Button') } }");
  });

  it('story with props - explicit return', function() {
    const result = simulateCallByAnalyzer(sources.getStoryWithPropsExplicitReturn());
    assert.equal(result.storyTemplate, '<my-button prefix=">>">click me</my-button>');
    assert.equal(result.storyLevelProps, "{ textKnob: { default: text('title', 'Hello Button') } }");
  });

  it('story with props as array of strings', function() {
    const result = simulateCallByAnalyzer(sources.getStoryWithPropsAsArray());
    assert.equal(result.storyTemplate, '<my-button prefix=">>">click me</my-button>');
    assert.equal(result.storyLevelProps, "['propA', 'propB']");
  });

  it('story with no template prop throws', function() {
    assert.throws(
      () => {
        simulateCallByAnalyzer(sources.getStoryReturningObjectMissingTemplate());
      },
      Error,
      userMessages.noSampleCodeIfNoTemplate()
    );
  });

  /**
   * Currently render is not supported
   */
  it('return object with render instead of template throws', function() {
    assert.throws(
      () => {
        simulateCallByAnalyzer(sources.getStoryWithRenderInsteadOfTemplate());
      },
      Error,
      userMessages.noSampleCodeIfNoTemplate()
    );
  });

  it('multiple returns throws', function() {
    assert.throws(
      () => {
        simulateCallByAnalyzer(sources.getStoryWithMultipleReturnStatements());
      },
      Error,
      userMessages.oneReturnStatementPerStory()
    );
  });

  it('returning a string throws', function() {
    assert.throws(
      () => {
        simulateCallByAnalyzer(sources.getStoryReturningString());
      },
      Error,
      userMessages.storyMustReturnObject()
    );
  });

  it('return object with non string template', function() {
    assert.throws(
      () => {
        simulateCallByAnalyzer(sources.getStoryReturningNonStringTemplate());
      },
      Error,
      userMessages.templateMustBeString()
    );
  });

  it('function with nested return extracts template', function() {
    const result = simulateCallByAnalyzer(sources.getStoryWithNestedReturn());
    assert.equal(result.storyTemplate, '<my-button prefix=">>">click me</my-button>');
  });

  it('template with template literal', function() {
    const result = simulateCallByAnalyzer(sources.getStoryWithTemplateLiteralInTemplate());
    assert.equal(result.storyTemplate, '<my-button id=${1} prefix=">>">${\'hey!\'} click me</my-button>');
  });

  it('data function inside the return value (multiple returns in a story, but in data function)', function() {
    const result = simulateCallByAnalyzer(sources.getStoryWithDataFunction());
    assert.equal(result.storyTemplate, '<my-button id=${tempId} prefix=">>">${\'hey!\'} click me</my-button>');
  });

  it('data arrow function (with return) inside the return value (multiple returns in a story, but in data function)', function() {
    const result = simulateCallByAnalyzer(sources.getStoryWithArrowDataFunctionWithReturn());
    assert.equal(result.storyTemplate, '<my-button id=${tempId} prefix=">>">${\'hey!\'} click me</my-button>');
  });

  it('data arrow function (with default return) inside the return value (multiple returns in a story, but in data function)', function() {
    const result = simulateCallByAnalyzer(sources.getStoryWithArrowDataFunctionWithAutoReturn());
    assert.equal(result.storyTemplate, '<my-button id=${tempId} prefix=">>">${\'hey!\'} click me</my-button>');
  });

  it('data arrow function with extra return statement in the body of the story', function() {
    assert.throws(
      () => {
        simulateCallByAnalyzer(sources.getStoryWithArrowDataFunctionWithReturnAndExtraReturnInBody());
      },
      Error,
      userMessages.oneReturnStatementPerStory()
    );
  });
});
