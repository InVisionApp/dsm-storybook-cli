const traverse = require('@babel/traverse').default;
const { assert } = require('chai');
const parser = require('../../../src/metadata/parser');
const userMessages = require('../../../src/user-messages');
const getFrameworkAnalyzer = require('../../../src/metadata/framework-analyzers').getFrameworkAnalyzer;
const sources = require('./data/react-framework-analyzer-test-cases');
const reactFrameworkAnalyzer = getFrameworkAnalyzer('react');

const simulateCallByAnalyzer = (source) => {
  const ast = parser(source);
  let result = {};

  traverse(ast, {
    CallExpression(path) {
      result = reactFrameworkAnalyzer.extractMetadata(path, source);
      path.stop();
    }
  });

  return result;
};

describe('Extracting React metadata (returnStatement)', function() {
  it('arrow func with explicit return extracts source', function() {
    const result = simulateCallByAnalyzer(sources.getStoryWithArrowExplicitReturn());
    assert.equal(result.returnStatement, '<Icon glyph="type-symbol" />');
  });

  it('arrow with implicit return extracts source', function() {
    const result = simulateCallByAnalyzer(sources.getStoryWithArrowImplicitReturn());
    assert.equal(result.returnStatement, '<Icon glyph="type-symbol" />');
  });

  it('function with explicit return extracts source', function() {
    const result = simulateCallByAnalyzer(sources.getStoryWithFunctionReturn());
    assert.equal(result.returnStatement, '<Icon glyph="type-symbol" />');
  });

  it('function nested returns extracts source', function() {
    const result = simulateCallByAnalyzer(sources.getStoryWithNestedReturn());
    assert.equal(result.returnStatement, '<Icon glyph="type-symbol" />');
  });

  it('supports es6 destructuring', function() {
    const result = simulateCallByAnalyzer(sources.getStoryWithDestructuring());
    assert.equal(result.returnStatement, '<Task {...actions} />');
  });

  it('supports React.Fragment', function() {
    const result = simulateCallByAnalyzer(sources.getStoryWithReactFragment());
    assert.equal(result.returnStatement, '<React.Fragment><Task /></React.Fragment>');
  });

  it('supports Fragment', function() {
    const result = simulateCallByAnalyzer(sources.getStoryWithFragment());
    assert.equal(result.returnStatement, '<Fragment><Task /></Fragment>');
  });

  it('supports <> </> (Fragment tags)', function() {
    const result = simulateCallByAnalyzer(sources.getStoryWithFragmentTags());
    assert.equal(result.returnStatement, '<><Task /></>');
  });

  it('mutliple returns throws', function() {
    assert.throws(
      () => {
        simulateCallByAnalyzer(sources.getStoryWithMultipleReturn());
      },
      Error,
      userMessages.oneReturnStatementPerStory()
    );
  });
});
