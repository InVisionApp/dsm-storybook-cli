import fs from 'fs-extra';
import { parse as babelParse } from 'react-docgen';
import { FileType } from '../../utils/parser-constants';
import getParserType from '../../utils/get-parser-type';

export function parse(componentFilePath) {
  const src = fs.readFileSync(componentFilePath, 'utf8');
  const parserType = getParserType(componentFilePath);
  const parserOptions = getDefaultParserOptions(parserType);

  return babelParse(src, null, null, { filename: componentFilePath, parserOptions: parserOptions });
}

// Manually add all plugins to ensure we are able to parse user code
// regardless of their babel tooling. Based on `react-docgen babelParser`:
// https://github.com/reactjs/react-docgen/blob/master/src/babelParser.js
function getDefaultParserOptions(type) {
  return {
    plugins: [
      'jsx',
      getLanguagePlugin(type), // load appropriate plugin based on language (JS, TS)
      'asyncGenerators',
      'bigInt',
      'classProperties',
      'classPrivateProperties',
      'classPrivateMethods',
      ['decorators', { decoratorsBeforeExport: false }],
      'doExpressions',
      'dynamicImport',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'functionBind',
      'functionSent',
      'importMeta',
      'logicalAssignment',
      'nullishCoalescingOperator',
      'numericSeparator',
      'objectRestSpread',
      'optionalCatchBinding',
      'optionalChaining',
      ['pipelineOperator', { proposal: 'minimal' }],
      'throwExpressions',
      'topLevelAwait'
    ]
  };
}

function getLanguagePlugin(type) {
  return type === FileType.TYPESCRIPT ? FileType.TYPESCRIPT : '';
}
