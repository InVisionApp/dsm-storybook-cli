const { assert } = require('chai');
const { replaceBySourceFile } = require('../src/cli/asset-files-utils/transform-assets-url');

const baseUrl = 'http://test.com';

describe('Transform assets urls tests - `replaceBySourceFile` function', function() {
  it(`Should transform url function in css files with ' `, function() {
    const src = `@font-face {
  font-family: 'a-font';
  src: url('/fonts/a-font.woff') format('woff');
}
`;
    const expected = `@font-face {
  font-family: 'a-font';
  src: url('${baseUrl}/fonts/a-font.woff') format('woff');
}
`;

    const result = replaceBySourceFile(src, 'file.css', { fileName: '/fonts/a-font.woff' }, baseUrl);
    assert.equal(result, expected);
  });

  it(`Should transform url function in css files with " `, function() {
    const src = `@font-face {
  font-family: 'a-font';
  src: url("/fonts/a-font.woff") format('woff');
}
`;
    const expected = `@font-face {
  font-family: 'a-font';
  src: url("${baseUrl}/fonts/a-font.woff") format('woff');
}
`;

    const result = replaceBySourceFile(src, 'file.css', { fileName: '/fonts/a-font.woff' }, baseUrl);
    assert.equal(result, expected);
  });

  it(`Should transform url function in css files without ' `, function() {
    const src = `@font-face {
  font-family: 'a-font';
  src: url(/fonts/a-font.woff) format('woff');
}
`;
    const expected = `@font-face {
  font-family: 'a-font';
  src: url(${baseUrl}/fonts/a-font.woff) format('woff');
}
`;

    const result = replaceBySourceFile(src, 'file.css', { fileName: '/fonts/a-font.woff' }, baseUrl);
    assert.equal(result, expected);
  });

  it('Should not transform url function in css files with a filename that is not found', function() {
    const src = `@font-face {
  font-family: 'a-font';
  src: url('/fonts/a-font.woff') format('woff');
}
`;
    const expected = `@font-face {
  font-family: 'a-font';
  src: url('/fonts/a-font.woff') format('woff');
}
`;

    const result = replaceBySourceFile(src, 'file.css', { fileName: '/fonts/not-found.woff' }, baseUrl);
    assert.equal(result, expected);
  });

  it(`Should transform url function that is inlined in js files with ' `, function() {
    const src = `e__(679)(!1)).push([module.i,"@font-face{font-family:'a-font';src:url(\\"/fonts/a-font.woff\\") format(\\"woff\\")}`;
    const expected = `e__(679)(!1)).push([module.i,"@font-face{font-family:'a-font';src:url(\\"${baseUrl}/fonts/a-font.woff\\") format(\\"woff\\")}`;

    const result = replaceBySourceFile(src, 'file.js', { fileName: '/fonts/a-font.woff' }, baseUrl);
    assert.equal(result, expected);
  });

  it('Should not transform url function that is inlined in js files with a filename that is not found', function() {
    const src = `e__(679)(!1)).push([module.i,"@font-face{font-family:'a-font';src:url(\\"/fonts/a-font.woff\\") format(\\"woff\\")}`;
    const expected = `e__(679)(!1)).push([module.i,"@font-face{font-family:'a-font';src:url(\\"/fonts/a-font.woff\\") format(\\"woff\\")}`;

    const result = replaceBySourceFile(src, 'file.js', { fileName: '/fonts/not-found.woff' }, baseUrl);
    assert.equal(result, expected);
  });

  it(`Should transform file names that are found within the src file and also inside inside urls functions' `, function() {
    const src = `fetch("/fonts/a-font.woff");e__(679)(!1)).push([module.i,"@font-face{font-family:'a-font';src:url(\\"/fonts/a-font.woff\\") format(\\"woff\\")}`;
    const expected = `fetch("${baseUrl}/fonts/a-font.woff");e__(679)(!1)).push([module.i,"@font-face{font-family:'a-font';src:url(\\"${baseUrl}/fonts/a-font.woff\\") format(\\"woff\\")}`;

    const result = replaceBySourceFile(src, 'file.js', { fileName: '/fonts/a-font.woff' }, baseUrl);
    assert.equal(result, expected);
  });

  it(`Should transform url function that is inlined in js files and also other file names that are found within the same file' `, function() {
    const src = `fetch("/static/a-file.json");e__(679)(!1)).push([module.i,"@font-face{font-family:'a-font';src:url(\\"/fonts/a-font.woff\\") format(\\"woff\\")}`;
    const expected1 = `fetch("/static/a-file.json");e__(679)(!1)).push([module.i,"@font-face{font-family:'a-font';src:url(\\"${baseUrl}/fonts/a-font.woff\\") format(\\"woff\\")}`;
    const expected2 = `fetch("${baseUrl}/static/a-file.json");e__(679)(!1)).push([module.i,"@font-face{font-family:'a-font';src:url(\\"${baseUrl}/fonts/a-font.woff\\") format(\\"woff\\")}`;

    const result1 = replaceBySourceFile(src, 'file.js', { fileName: '/fonts/a-font.woff' }, baseUrl);
    assert.equal(result1, expected1);
    const result2 = replaceBySourceFile(result1, 'file.js', { fileName: '/static/a-file.json' }, baseUrl);
    assert.equal(result2, expected2);
  });

  it(`Should not transform file names that are not within " or ' `, function() {
    const src = `some.code();a-file.json;e__(679)(!1)).push([module.i,"@font-face{font-family:'a-font';src:url(\\"/fonts/a-font.woff\\") format(\\"woff\\")}`;
    const expected = `some.code();a-file.json;e__(679)(!1)).push([module.i,"@font-face{font-family:'a-font';src:url(\\"${baseUrl}/fonts/a-font.woff\\") format(\\"woff\\")}`;

    const result1 = replaceBySourceFile(src, 'file.js', { fileName: '/fonts/a-font.woff' }, baseUrl);
    assert.equal(result1, expected);
    const result2 = replaceBySourceFile(result1, 'file.js', { fileName: 'a-file.json' }, baseUrl);
    assert.equal(result2, expected);
  });
});
