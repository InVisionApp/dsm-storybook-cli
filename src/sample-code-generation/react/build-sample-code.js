const prettier = require('prettier/standalone');
const plugins = [require('prettier/parser-babylon')];
const isEmpty = require('lodash/isEmpty');
const { INJECTED_SOURCE_PLACEHOLDER } = require('../../addons/constants');
const {
  getChildrenString,
  getFieldValue,
  getPropValueString,
  hasValueSet,
  isDefaultValue
} = require('../build-sample-code-utils');

/**
 * Builds the sample code string
 * @param sampleCodeMetadata - the object describing the sample code, created by sample-code-analyzer
 * @param knobs - the selected knobs object as sent from the knobs addon. Example: { knob-label: { type: "text", value: "selected value", ...}}
 * @param propsInfo - information about the props of the story subject, as extracted from docgen
 * @param prettierConfig - options to pass to prettier format
 * @return {string} - the formatted sample code with placeholders for knobs values
 */
module.exports = function(sampleCodeMetadata, prettierConfig = {}, propsInfo = {}, knobs) {
  if (isEmpty(sampleCodeMetadata)) {
    return '';
  }

  const openTag = `<${sampleCodeMetadata.componentName}`;
  const propsString = getAllPropsString(sampleCodeMetadata.props, propsInfo, knobs);
  const childrenString = getChildrenString(sampleCodeMetadata.children, knobs);
  const openTagPostfix = childrenString ? '>' : '/>';
  const closeTag = childrenString ? `</${sampleCodeMetadata.componentName}>` : '';

  const storySubject = `${openTag} ${propsString} ${openTagPostfix}${childrenString}${closeTag}`;

  const sampleCode = sampleCodeMetadata.sourceTemplate.replace(INJECTED_SOURCE_PLACEHOLDER, storySubject);
  const prettierOptions = Object.assign({}, { parser: 'babel', plugins }, prettierConfig);

  try {
    return prettier.format(sampleCode, prettierOptions);
  } catch (e) {
    // In case the result is not a valid code snippet (probably because of knobs value) return the syntax error
    return e.message;
  }
};

// Build a string containing all props: 'prop1Name=value1 prop2name=value2'
function getAllPropsString(props, propsDocgenInfo, knobs) {
  if (!props || props.length === 0) {
    return '';
  }

  return props.reduce((acc, prop) => `${acc} ${getSinglePropString(prop, propsDocgenInfo[prop.name], knobs)}`, '');
}

// Translate the prop object to a string. Few examples:
// { name: "prop-name", value: 5 } => prop-name={5}
// { name: "prop-name", value: "hello" } => prop-name="hello"
// { name: "prop-name", knobLabel: "prop-label" } + knobs: { prop-label: { value: 5 }} => prop-name={5}
// { name: "prop-name", value: 5 } + propDocgenInfo: { defaultValue: { value: 5 }}  => ''
function getSinglePropString(prop, propDocgenInfo, knobs) {
  // If a value wasn't set for the prop we don't add it to the sample code
  if (!hasValueSet(prop, knobs)) {
    return '';
  }

  const propValue = getFieldValue(prop, knobs);

  // If the prop value is equal to the default value, we don't need to add it to the sample code
  if (isDefaultValue(propDocgenInfo, propValue)) {
    return '';
  }

  // If the prop type is boolean and value is true, just write the property name
  // for example: // { name: "disabled", value: true } => <Button disabled />
  if (typeof propValue === 'boolean' && propValue) {
    return `${prop.name}`;
  }

  const useStringQuotes = !prop.isExpression && typeof propValue === 'string';

  const openingBracket = useStringQuotes ? '"' : '{';
  const closingBracket = useStringQuotes ? '"' : '}';

  /**
   * If prop name is available we use it, if not we will show only the prop value
   * Can happen in spread operators, for example:
   * <Button {...props} />
   */
  return prop.name
    ? `${prop.name}=${openingBracket}${getPropValueString(propValue)}${closingBracket} `
    : getPropValueString(propValue);
}
