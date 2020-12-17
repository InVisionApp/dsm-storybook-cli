const chai = require('chai');
const { assert } = chai;
const { getStoryUrlParams } = require('../../../src/versions/v5.1.1/get-story-url-params');

describe('story url params', function() {
  it('plain kind returns kind', function() {
    const result = getStoryUrlParams('kind', 'name');
    assert.equal(result.path, '/story/kind--name');
  });

  it('kind with hierarchy returns path without hierarchy', function() {
    const result = getStoryUrlParams('level1/kind', 'name');
    assert.equal(result.path, '/story/level1-kind--name');
  });

  it('kind with grouping returns path without grouping', function() {
    const result = getStoryUrlParams('level1|kind', 'name');
    assert.equal(result.path, '/story/level1-kind--name');
  });

  // smoke test that we're running through the sanitizer
  it('story name with special characters returns sanitized name', function() {
    const result = getStoryUrlParams('kind', 'name (parenthesis)');
    assert.equal(result.path, '/story/kind--name-parenthesis');
  });
});

describe('story url params with canvas as default tab', function() {
  const defaultTab = false;

  it('plain kind returns kind', function() {
    const result = getStoryUrlParams('kind', 'name', defaultTab);
    assert.equal(result.path, '/story/kind--name');
  });

  it('kind with hierarchy returns path without hierarchy', function() {
    const result = getStoryUrlParams('level1/kind', 'name', defaultTab);
    assert.equal(result.path, '/story/level1-kind--name');
  });

  it('kind with grouping returns path without grouping', function() {
    const result = getStoryUrlParams('level1|kind', 'name', defaultTab);
    assert.equal(result.path, '/story/level1-kind--name');
  });

  // smoke test that we're running through the sanitizer
  it('story name with special characters returns sanitized name', function() {
    const result = getStoryUrlParams('kind', 'name (parenthesis)', defaultTab);
    assert.equal(result.path, '/story/kind--name-parenthesis');
  });
});

describe('story url params with docs as default tab', function() {
  const defaultTab = true;

  it('plain kind returns kind', function() {
    const result = getStoryUrlParams('kind', 'name', defaultTab);
    assert.equal(result.path, '/docs/kind--name');
  });

  it('kind with hierarchy returns path without hierarchy', function() {
    const result = getStoryUrlParams('level1/kind', 'name', defaultTab);
    assert.equal(result.path, '/docs/level1-kind--name');
  });

  it('kind with grouping returns path without grouping', function() {
    const result = getStoryUrlParams('level1|kind', 'name', defaultTab);
    assert.equal(result.path, '/docs/level1-kind--name');
  });

  // smoke test that we're running through the sanitizer
  it('story name with special characters returns sanitized name', function() {
    const result = getStoryUrlParams('kind', 'name (parenthesis)', defaultTab);
    assert.equal(result.path, '/docs/kind--name-parenthesis');
  });
});
