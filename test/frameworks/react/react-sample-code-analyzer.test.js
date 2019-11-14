const chai = require('chai');
const { assert, expect } = chai;
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
chai.use(deepEqualInAnyOrder);

const analyzer = require('../../../src/sample-code-generation/react/sample-code-analyzer');
const sources = require('./data/react-sample-code-analyzer-test-cases');

describe('React sample code analyzer', function() {
  it('analyzer accepts null arg', function() {
    assert.equal(analyzer(null), null);
  });

  it('simple story without knobs and without wrapper code returns the component and its props', function() {
    const storyTestCase = sources.getSimpleStory();
    runTest(storyTestCase);
  });

  it('simple story without children returns empty children field', function() {
    const storyTestCase = sources.getSimpleStoryWithoutChildren();
    runTest(storyTestCase);
  });

  it('simple story without knobs that has expressions in prop value returns the expressions as-is', function() {
    const storyTestCase = sources.getSimpleStoryWithExpressionsInProp();
    runTest(storyTestCase);
  });

  it('simple story without knobs that has anonymous functions in prop value returns the function calls as-is', function() {
    const storyTestCase = sources.getSimpleStoryWithAnonymousFunctionsInProp();
    runTest(storyTestCase);
  });

  it('complex story without knobs extracts the wrapping code and children', function() {
    const storyTestCase = sources.getComplexStory();
    runTest(storyTestCase);
  });

  it('simple story with knobs returns the props after parsing the knobs', function() {
    const storyTestCase = sources.getSimpleKnobsStory();
    runTest(storyTestCase);
  });

  it('simple story with knobs usage in children, parses also the children knobs', function() {
    const storyTestCase = sources.getSimpleKnobsStoryWithKnobsInChildren();
    runTest(storyTestCase);
  });

  it('simple story with knobs that use default values (no second param) returns the props after parsing the knobs with labels only', function() {
    const storyTestCase = sources.getSimpleKnobsStoryWithDefaultValues();
    runTest(storyTestCase);
  });

  it('complex story with knobs and component override returns wrapping code and knobs as expected', function() {
    const storyTestCase = sources.getComplexKnobsStoryWithComponentConfig();
    runTest(storyTestCase);
  });

  //TODO: when changing the code to break when this case happens we'll have to fix this test expected value.
  it('story with component explicitly defined to a JSX element that is not used in the return statement of the story', function() {
    const storyTestCase = sources.getStoryWithWrongComponentElementDefined();
    runTest(storyTestCase);
  });

  it('simple story with es6 destructuring', function() {
    const storyTestCase = sources.getSimpleKnobsStoryWithDestructuring();
    runTest(storyTestCase);
  });

  it('simple story with knobs wrapped in React.Fragment', function() {
    const storyTestCase = sources.getSimpleKnobsStoryReactFragment();
    runTest(storyTestCase);
  });

  it('simple story with knobs wrapped in Fragment', function() {
    const storyTestCase = sources.getSimpleKnobsStoryFragment();
    runTest(storyTestCase);
  });

  it('simple story with knobs wrapped in <> </> (Fragment tags)', function() {
    const storyTestCase = sources.getSimpleKnobsStoryReactFragmentTags();
    runTest(storyTestCase);
  });
});

function runTest(storyTestCase) {
  const result = analyzer(storyTestCase.metadata);
  expect(result).to.equalInAnyOrder(storyTestCase.expected);
}
