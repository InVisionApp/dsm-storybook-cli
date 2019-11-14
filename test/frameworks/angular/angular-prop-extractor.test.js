const { assert } = require('chai');
const path = require('path');
const propExtractor = require('../../../src/metadata/framework-analyzers/angular/prop-extractor');

let componentFilePath = undefined;

beforeAll(function() {
  componentFilePath = path.resolve(__dirname, './data/button.component.ts');
});

describe('angular - prop extractor', function() {
  it('extracts component data', function() {
    const docgenInfo = propExtractor.extract(componentFilePath);
    assert.equal(docgenInfo.description, 'This description is coming from JSDoc comment on button.component');
    assert.equal(docgenInfo.displayName, 'ButtonComponent');
    assert.equal(docgenInfo.selector, 'storybook-button-component');
  });

  it('extracts prop description', function() {
    const docgenInfo = propExtractor.extract(componentFilePath);
    assert.equal(docgenInfo.props.disabled.description, 'Is button disabled');
  });

  it('extracts default value', function() {
    const docgenInfo = propExtractor.extract(componentFilePath);
    assert.equal(docgenInfo.props.disabled.defaultValue.value, 'false');
  });

  it('props without default value do not have default value in the docgen', function() {
    const docgenInfo = propExtractor.extract(componentFilePath);
    assert.equal(docgenInfo.props.dummyProp.defaultValue, undefined);
  });

  it('handles multiple string options', function() {
    const docgenInfo = propExtractor.extract(componentFilePath);
    assert.equal(docgenInfo.props.buttonType.type.name, 'enum');
    assert.equal(docgenInfo.props.buttonType.type.value[1].value, "'secondary'");
  });

  it('handles multiple number options', function() {
    const docgenInfo = propExtractor.extract(componentFilePath);
    assert.equal(docgenInfo.props.anotherProp.type.name, 'enum');
    assert.equal(docgenInfo.props.anotherProp.type.value[2].value, '3');
    assert.equal(docgenInfo.props.anotherProp.defaultValue.value, '2');
  });

  it('handles number type', function() {
    const docgenInfo = propExtractor.extract(componentFilePath);
    assert.equal(docgenInfo.props.height.type.name, 'number');
    assert.equal(docgenInfo.props.height.defaultValue.value, '5');
  });
});
