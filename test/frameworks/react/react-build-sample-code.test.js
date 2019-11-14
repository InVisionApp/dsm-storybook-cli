const { assert } = require('chai');
const sampleCodeBuilder = require('../../../src/sample-code-generation/react/build-sample-code');
const sources = require('./data/react-build-sample-code-test-cases');

describe('Sample code builder', function() {
  it('accepts null arg (return empty string)', function() {
    assert.equal(sampleCodeBuilder(null), '');
  });

  it('accepts empty object (return empty string)', function() {
    assert.equal(sampleCodeBuilder({}), '');
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

  it('complex story with knobs and component override returns wrapping code and knobs as expected', function() {
    const storyTestCase = sources.getComplexKnobsStoryWithComponentConfig();
    runTest(storyTestCase);
  });

  it('When a knob is set just like the default value, dont include the prop in the sample code', function() {
    const storyTestCase = sources.getStoryWithKnobSetAsDefaultValue();
    runTest(storyTestCase);
  });

  it('When default value was not defined and the value is set to a falsy value, dont include the prop in the sample code', function() {
    const storyTestCase = sources.getStoryWithValueSetAsFalsyValueWhenNoDefaultValueExplicitlyDefined();
    runTest(storyTestCase);
  });

  it('story with object prop', function() {
    const storyTestCase = sources.getStoryWithObjectProp();
    runTest(storyTestCase);
  });

  it('story with array of objects prop', function() {
    const storyTestCase = sources.getStoryWithArrayOfObjectsProp();
    runTest(storyTestCase);
  });

  it('story with array of objects prop set as default value', function() {
    const storyTestCase = sources.getStoryWithArrayOfObjectsPropWithDefaultValue();
    runTest(storyTestCase);
  });

  it('story with array of numbers prop', function() {
    const storyTestCase = sources.getStoryWithArrayOfNumbersProp();
    runTest(storyTestCase);
  });

  it('story with array of numbers prop set as default value', function() {
    const storyTestCase = sources.getStoryWithArrayOfNumbersPropWithDefaultValue();
    runTest(storyTestCase);
  });

  it('story with array of strings prop', function() {
    const storyTestCase = sources.getStoryWithArrayOfStringsProp();
    runTest(storyTestCase);
  });

  it('story with array of strings prop set as default value', function() {
    const storyTestCase = sources.getStoryWithArrayOfStringsPropWithDefaultValue();
    runTest(storyTestCase);
  });

  it('story with boolean field with true value set prop name only', function() {
    const storyTestCase = sources.getStoryWithValueSetAsTrueWhenNoDefaultValueExplicitlyDefined();
    runTest(storyTestCase);
  });

  it('story es6 spread\\destructuring', function() {
    const storyTestCase = sources.getSimpleKnobsStoryWithDestructuring();
    runTest(storyTestCase);
  });

  it('story with knobs and wrapped in React.Fragment', function() {
    const storyTestCase = sources.getSimpleKnobsStoryReactFragment();
    runTest(storyTestCase);
  });

  it('story with knobs and wrapped in Fragment', function() {
    const storyTestCase = sources.getSimpleKnobsStoryFragment();
    runTest(storyTestCase);
  });

  it('story with knobs and wrapped in <> </> (Fragment tags)', function() {
    const storyTestCase = sources.getSimpleKnobsStoryFragmentTags();
    runTest(storyTestCase);
  });
});

function runTest(storyTestCase) {
  const result = sampleCodeBuilder(
    storyTestCase.metadata,
    storyTestCase.prettierConfig,
    storyTestCase.propsInfo || {},
    storyTestCase.knobs
  );
  assert.equal(result, storyTestCase.expected);
}
