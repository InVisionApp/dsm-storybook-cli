const { assert } = require('chai');
const path = require('path');
const propExtractor = require('../../../src/metadata/framework-analyzers/vue/prop-extractor');

let componentFilePath = undefined;

beforeAll(function() {
  componentFilePath = path.resolve(__dirname, './data/MyButton.vue');
});

describe('vue - prop extractor', function() {
  it('extracts prop description', function() {
    const docgenInfo = propExtractor.extract(componentFilePath);
    assert.equal(docgenInfo.props.propD.description, 'Number with a default value');
  });

  it('extracts is-required', function() {
    const docgenInfo = propExtractor.extract(componentFilePath);
    assert.equal(docgenInfo.props.propC.required, true);
  });

  it('extracts default value', function() {
    const docgenInfo = propExtractor.extract(componentFilePath);
    assert.equal(docgenInfo.props.propD.defaultValue.value, '100');
  });
});
