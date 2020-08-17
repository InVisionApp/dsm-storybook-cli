const chai = require('chai');
const { assert, expect } = chai;
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const analyzer = require('../../../src/sample-code-generation/angular/sample-code-analyzer');
const sources = require('./data/angular-sample-code-analyzer-test-cases');

chai.use(deepEqualInAnyOrder);

describe('Angular sample code analyzer', function() {
  it('analyzer accepts null arg', function() {
    assert.equal(analyzer(null), null);
  });

  // currently this case is prevented in the angular framework analyzer,
  // but in case we ever want to allow rendering such stories in DSM (without sample code)
  it('returns null for story without a template', function() {
    const storyTestCase = sources.getStoryWithNoTemplate();
    runTest(storyTestCase);
  });

  it('simple story without knobs', function() {
    const storyTestCase = sources.getSimpleStory();
    runTest(storyTestCase);
  });

  it('with story level props but no knobs', function() {
    const storyTestCase = sources.getStoryWithStoryLevelPropsWithoutKnobs();
    runTest(storyTestCase);
  });

  it('story with binding in children', function() {
    const storyTestCase = sources.getStoryWithBindingInChildren();
    runTest(storyTestCase);
  });

  it('story with elements as children', function() {
    const storyTestCase = sources.getStoryWithElementsInChildren();
    runTest(storyTestCase);
  });

  it('story with property binding and event binding', function() {
    const storyTestCase = sources.getStoryWithPropertyAndEventBinding();
    runTest(storyTestCase);
  });

  it('story with attribute directives', function() {
    const storyTestCase = sources.getStoryWithAttributeDirective();
    runTest(storyTestCase);
  });

  it('simple story template has newline chars', function() {
    const storyTestCase = sources.getSimpleStoryWithNewlinesInTemplate();
    runTest(storyTestCase);
  });

  it('story with 2 way binding', function() {
    const storyTestCase = sources.getStoryWithTwoWayBinding();
    runTest(storyTestCase);
  });

  it('story with 2 way binding, 1 way binding, and attribute', function() {
    const storyTestCase = sources.getStoryWithAllTemplateBindingsAndKnobs();
    runTest(storyTestCase);
  });

  it('story with a knob for the component content', function() {
    const storyTestCase = sources.getSimpleStoryWithKnobInChildren();
    runTest(storyTestCase);
  });

  it('story with multiple knobs and binding for the component content', function() {
    const storyTestCase = sources.getStoryWithMultipleChildrenIncludingKnobs();
    runTest(storyTestCase);
  });

  it('story with a knob in prop', function() {
    const storyTestCase = sources.getStoryWithKnobInProp();
    runTest(storyTestCase);
  });

  it('story with a knob in prop that is not in imports', function() {
    const storyTestCase = sources.getStoryWithKnobInPropThatIsNotImported();
    runTest(storyTestCase);
  });

  it('simple story with explicit component in in-dsm', function() {
    const storyTestCase = sources.getStoryWithExplicitComponentName();
    runTest(storyTestCase);
  });

  it('simple story with explicit component in in-dsm - no single root tag and no component in in-dsm', function() {
    const storyTestCase = sources.getStoryWithNoRootTagInTemplateWithNoExplicitComponentName();
    runTest(storyTestCase);
  });

  it('simple story with explicit component in in-dsm - no single root tag', function() {
    const storyTestCase = sources.getStoryWithNoRootTagInTemplateWithExplicitComponentName();
    runTest(storyTestCase);
  });

  it('story with explicit component in in-dsm which does not exist in template', function() {
    const storyTestCase = sources.getStoryWithExplicitComponentNameWhichDoesNotExist();
    runTest(storyTestCase);
  });

  it('story with self closing html tag in children', function() {
    const storyTestCase = sources.getStorySelfClosingTagInChildren();
    runTest(storyTestCase);
  });
});

function runTest(storyTestCase) {
  const result = analyzer(storyTestCase.metadata);
  expect(result).to.equalInAnyOrder(storyTestCase.expected);
}
