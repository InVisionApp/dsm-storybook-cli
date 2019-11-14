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

  it('kind with multi-separator returns dashed kind', function() {
    const result = getStoryUrlParams('level1|level2|level3/level4/kind', 'name (parenthesis)');
    assert.equal(result.path, '/story/level1-level2-level3-level4-kind--name-parenthesis');
  });
});
