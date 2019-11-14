const { assert } = require('chai');
const componentLocator = require('../src/metadata/component-locator');

describe('component locator sanity', function() {
  it('accepts null args', function() {
    assert.doesNotThrow(componentLocator.resolveFromComponentName);
  });

  it('invalid node does not throw', function() {
    assert.doesNotThrow(() => componentLocator.resolveFromComponentName('componentName'));
  });

  it('invalid path does not throw', function() {
    assert.doesNotThrow(() =>
      componentLocator.resolveFromComponentName('componentName', { componentPath: 'dummy-path' }, null, __dirname)
    );
  });
});
