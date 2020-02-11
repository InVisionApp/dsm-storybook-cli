const getParserType = require('../src/metadata/utils/get-parser-type');
const { FileType } = require('../src/metadata/utils/parser-constants');

// _We_ currently support `js`, `jsx`, `ts,` and `tsx`. Storybook files
// are typically only written in `js` and `tsx`.
describe('Get the file type from the source file', function() {
  it('gets "javascript" from a JavaScript file', function() {
    testCase('example.js', FileType.JAVASCRIPT);
  });

  it('gets "javascript" from a JavaScript JSX file', function() {
    testCase('example.jsx', FileType.JAVASCRIPT);
  });

  it('gets "typescript" from a TypeScript file', function() {
    testCase('example.ts', FileType.TYPESCRIPT);
  });

  it('gets "typescript" from a TypeScript JSX file', function() {
    testCase('example.tsx', FileType.TYPESCRIPT);
  });
});

function testCase(fileName, expectedLanguage) {
  const result = getParserType(fileName);
  expect(result).toBe(expectedLanguage);
}
