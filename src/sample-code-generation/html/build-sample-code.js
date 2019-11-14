const prettier = require('prettier/standalone');
const plugins = [require('prettier/parser-html')];
const isEmpty = require('lodash/isEmpty');

/**
 * Builds the sample code string
 * @param sampleCodeMetadata - the object describing the sample code, created by sample-code-analyzer
 * @param knobs - the selected knobs object as sent from the knobs addon. Example: { knob-label: { type: "text", value: "selected value", ...}}
 * @param propsInfo - information about the props of the story subject, as extracted from docgen
 * @param prettierConfig - options to pass to prettier format
 * @return {string} - the formatted sample code with placeholders for knobs values
 */
// In Html framework we only want to run prettier on the sample code we receive from Storybook on runtime
// eslint-disable-next-line no-unused-vars
module.exports = function({ sampleCode }, prettierConfig = {}, propsInfo = {}, knobs) {
  if (isEmpty(sampleCode)) {
    return '';
  }

  const prettierOptions = Object.assign({}, { parser: 'html', plugins }, prettierConfig);

  try {
    return prettier.format(sampleCode, prettierOptions);
  } catch (e) {
    // In case the result is not a valid code snippet (probably because of knobs value) return the syntax error
    return e.message;
  }
};
