const chai = require('chai');
const { assert, expect } = chai;
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const analyzer = require('../../../src/sample-code-generation/vue/sample-code-analyzer');
const sources = require('./data/vue-sample-code-analyzer-test-cases');

chai.use(deepEqualInAnyOrder);

describe('Vue sample code analyzer', function() {
  it('analyzer accepts null arg', function() {
    assert.equal(analyzer(null), null);
  });

  it('simple story without knobs', function() {
    const storyTestCase = sources.getSimpleStory();
    runTest(storyTestCase);
  });

  it('simple story with special props values', function() {
    const storyTestCase = sources.getSimpleStoryWithSpecialPropValues();
    runTest(storyTestCase);
  });

  it('simple story with v- props with no value', function() {
    const storyTestCase = sources.getSimpleStoryWithVPropWithNoValue();
    runTest(storyTestCase);
  });

  it('simple story template has newline chars', function() {
    const storyTestCase = sources.getSimpleStoryWithNewlinesInTemplate();
    runTest(storyTestCase);
  });

  it('story with StoryLevelProps as array of strings', function() {
    const storyTestCase = sources.getStoryWithStoryLevelPropsAsArray();
    runTest(storyTestCase);
  });

  it('simple story with a knob for the component slot', function() {
    const storyTestCase = sources.getSimpleStoryWithKnobInSlot();
    runTest(storyTestCase);
  });

  it('simple story with regular (none knobs) story level props', function() {
    const storyTestCase = sources.getSimpleStoryWithSimpleStoryLevelProps();
    runTest(storyTestCase);
  });

  it('story with multiple children including knobs', function() {
    const storyTestCase = sources.getStoryWithMultipleChildrenIncludingKnobs();
    runTest(storyTestCase);
  });

  it('story with multiple children including knobs and other bindings', function() {
    const storyTestCase = sources.getStoryWithMultipleChildrenIncludingKnobsAndOtherBindings();
    runTest(storyTestCase);
  });

  it('story with knobs that are not imported', function() {
    const storyTestCase = sources.getStoryWithKnobsThatAreNotImported();
    runTest(storyTestCase);
  });

  it('simple story with v-bind binding for knobs', function() {
    const storyTestCase = sources.getSimpleStoryWithKnobInVBind();
    runTest(storyTestCase);
  });

  it('simple story with v-bind shorthand binding for knobs', function() {
    const storyTestCase = sources.getSimpleStoryWithKnobInVBindShorthand();
    runTest(storyTestCase);
  });

  it('simple story with explicit component in in-dsm', function() {
    const storyTestCase = sources.getStoryWithExplicitComponentName();
    runTest(storyTestCase);
  });

  it('story with explicit component in in-dsm which does not exist in template', function() {
    const storyTestCase = sources.getStoryWithExplicitComponentNameWhichDoesNotExist();
    runTest(storyTestCase);
  });

  it('story with multiple children - complex example 1', function() {
    const storyTestCase = sources.getStoryWithMultipleChildrenComplexExample1();
    runTest(storyTestCase);
  });

  it('story with multiple children - complex example 2', function() {
    const storyTestCase = sources.getStoryWithMultipleChildrenComplexExample2();
    runTest(storyTestCase);
  });
});

function runTest(storyTestCase) {
  const result = analyzer(storyTestCase.metadata);
  expect(result).to.equalInAnyOrder(storyTestCase.expected);
}
