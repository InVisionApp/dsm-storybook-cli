const fs = require('fs-extra');
const reactDocGen = require('react-docgen');
const isUndefined = require('lodash/isUndefined');

/**
 * Attempt to extract prop definitions and add them as a "props" property on "dsmInfo"
 * */
function extract(componentFilePath) {
  if (!componentFilePath) {
    return;
  }

  const src = fs.readFileSync(componentFilePath, 'utf8');
  const docgenInfo = reactDocGen.parse(src, null, null, { filename: componentFilePath });

  return normalizeDocgenInfo(docgenInfo);
}

function normalizeDocgenInfo(docgenInfo) {
  if (!docgenInfo.props) {
    return docgenInfo;
  }

  const { props } = docgenInfo;
  const propKeys = Object.keys(props);

  if (isPlainJsPropType(propKeys, props)) {
    return docgenInfo;
  }

  // normalize tsType\flowType
  const normalizedProps = {};

  propKeys.forEach((key) => {
    const prop = props[key];
    const isTypedProp = prop['tsType'] || prop['flowType'];

    // not removing 'tsType'\'flowType' so we will have more information in case of future issues.
    let normalizedProp = { ...prop };

    // if there is a special type normalize it if not return the prop as is.
    if (isTypedProp) {
      normalizedProp.type = normalizeType(isTypedProp);
    }

    normalizedProps[key] = normalizedProp;
  });

  return { ...docgenInfo, props: normalizedProps };
}

const REACT_NODE_TYPE = 'ReactReactNode';
const ELEMENTS_TYPES = ['union'];
const COMPLEX_TYPES = ['signature', 'intersection', 'tuple'];
const LITERAL_TYPE = 'literal';

function normalizeType(type) {
  if (type.name === REACT_NODE_TYPE) {
    return { name: 'ReactNode' };
  }

  if (type.name === LITERAL_TYPE) {
    return type;
  }

  // types with a number of allowed values
  if (ELEMENTS_TYPES.includes(type.name)) {
    return { name: type.name, value: type.elements };
  }

  // set the value as the RAW value as it's in the code
  if (COMPLEX_TYPES.includes(type.name)) {
    return { name: type.name, value: type.raw };
  }

  // simple types
  if (type.name && isUndefined(type.value) && isUndefined(type.raw)) {
    return { name: type.name };
  }

  return { name: type.raw };
}

/**
 * if all props don't have tsType or flowType it means it's a regular propType.
 * example of a tsType\flowType docgen prop:
 *
 * "icon": {
 *    "required": false,
 *    "tsType": {
 *      "name": "union",
 *      "raw": "'none' | 'chevron-right'",
 *      "elements": [{ "name": "literal", "value": "'none'" }, { "name": "literal", "value": "'chevron-right'" }]
 *    },
 *    "description": "Adds an icon to the button",
 *    "defaultValue": { "value": "'none'", "computed": false }
 *  }
 *
 * the 'type' property is 'tsType' instead of 'type' in case of TypeScript
 * the 'type' property is 'flowType' instead of 'type' in case of Flow
 */
function isPlainJsPropType(propKeys, props) {
  return propKeys.every((key) => !props[key]['tsType'] && !props[key]['flowType']);
}

module.exports = {
  extract
};
