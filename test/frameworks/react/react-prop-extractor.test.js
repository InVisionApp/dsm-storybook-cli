const { assert } = require('chai');
const path = require('path');
const propExtractor = require('../../../src/metadata/framework-analyzers/react/prop-extractor');

let componentFilePath = undefined;

beforeAll(function() {
  componentFilePath = path.resolve(__dirname, './data/Button.jsx');
});

describe('react - prop extractor', function() {
  it('extracts component data', function() {
    const docgenInfo = propExtractor.extract(componentFilePath);
    assert.equal(docgenInfo.description, 'Button description');
    assert.equal(docgenInfo.displayName, 'Button');
  });

  it('extracts prop description', function() {
    const docgenInfo = propExtractor.extract(componentFilePath);
    assert.equal(docgenInfo.props.disabled.description, 'Disable state of the button');
  });

  it('extracts default value', function() {
    const docgenInfo = propExtractor.extract(componentFilePath);
    assert.equal(docgenInfo.props.disabled.defaultValue.value, 'false');
  });

  it('props without default value do not have default value in the docgen', function() {
    const docgenInfo = propExtractor.extract(componentFilePath);
    assert.equal(docgenInfo.props.icon.defaultValue, undefined);
  });

  it('handles multiple string options', function() {
    const docgenInfo = propExtractor.extract(componentFilePath);
    assert.equal(docgenInfo.props.icon.type.name, 'enum');
    assert.equal(docgenInfo.props.icon.type.value[0].value, "'chevron-right'");
    assert.equal(docgenInfo.props.icon.type.value[1].value, "'another-icon'");
  });

  it('handles multiple number options', function() {
    const docgenInfo = propExtractor.extract(componentFilePath);
    assert.equal(docgenInfo.props.anotherProp.type.name, 'enum');
    assert.equal(docgenInfo.props.anotherProp.type.value[2].value, 3);
    assert.equal(docgenInfo.props.anotherProp.defaultValue.value, 2);
  });

  it('handles number type', function() {
    const docgenInfo = propExtractor.extract(componentFilePath);
    assert.equal(docgenInfo.props.onClick.type.name, 'func');
  });
});
