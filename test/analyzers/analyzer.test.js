const chai = require('chai');
const { assert } = chai;
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const parser = require('../../src/metadata/parser');
const analyzer = require('../../src/metadata/analyzer');
const fs = require('fs');
const path = require('path');

/**
 * In the analyzer tests we are using the react-framework-analyzer by default
 */
const DEFAULT_FRAMEWORK = 'react';

chai.use(deepEqualInAnyOrder);

describe('Fixed client issues - React', function() {
  it('nested story function parses ok', function() {
    const fileName = path.resolve(__dirname, '../data/third-party/DateRangePicker_calendar.js');
    const src = fs.readFileSync(fileName, 'utf8');
    const ast = parser(src);
    const result = analyzer(ast, src, './data/DateRangePicker_calendar.js', DEFAULT_FRAMEWORK);
    assert.equal(result.stories[0].frameworkMetadata.returnStatement, '<DateRangePickerWrapper autoFocus />');
  });

  it('file with multiple fixtures with same name parses ok', function() {
    const fileName = path.resolve(__dirname, '../data/third-party/pagination-toolbar.story.js');
    const src = fs.readFileSync(fileName, 'utf8');
    const ast = parser(src);
    const result = analyzer(ast, src, './data/DateRangePicker_calendar.js', DEFAULT_FRAMEWORK);
    assert.equal(result.stories.length, 4);
  });

  it('story with dynamic props parses ok', function() {
    const fileName = path.resolve(__dirname, '../data/third-party/CodeSnippet-story.js');
    const src = fs.readFileSync(fileName, 'utf8');
    const ast = parser(src);
    const result = analyzer(ast, src, './data/DateRangePicker_calendar.js', DEFAULT_FRAMEWORK);
    assert.equal(result.stories.length, 2);
  });

  /**
   * This test validates that the user can import a component by specifying the folder if the component filename is index.js
   * */
  it('story with implicit index.js import parses ok', function() {
    const fileName = path.resolve(__dirname, '../data/component-locator/button/stories/index.js');
    const src = fs.readFileSync(fileName, 'utf8');
    const ast = parser(src);
    const result = analyzer(ast, src, fileName, DEFAULT_FRAMEWORK);
    assert.equal(result.stories.length, 1);
  });

  it('story with component import without extension parses ok', function() {
    const fileName = path.resolve(__dirname, '../data/component-locator/button/stories/card.stories.js');
    const src = fs.readFileSync(fileName, 'utf8');
    const ast = parser(src);
    const result = analyzer(ast, src, fileName, DEFAULT_FRAMEWORK);
    assert.equal(result.stories.length, 1);
    assert.equal(result.stories[0].dsmInfo.docgenInfo.props.elevated.description, 'sets whether this card is elevated');
  });

  it('story with component import with extension parses ok', function() {
    const fileName = path.resolve(__dirname, '../data/component-locator/button/stories/card.with-extension.stories.js');
    const src = fs.readFileSync(fileName, 'utf8');
    const ast = parser(src);
    const result = analyzer(ast, src, fileName, DEFAULT_FRAMEWORK);
    assert.equal(result.stories.length, 1);
    assert.equal(result.stories[0].dsmInfo.docgenInfo.props.elevated.description, 'sets whether this card is elevated');
  });
});
