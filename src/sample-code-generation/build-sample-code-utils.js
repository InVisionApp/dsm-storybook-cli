// Translate the children array to a string. Few examples:
// [{ value: "my age is: " }, { value: 5 }] => my age is: 5
// [{ value: "my age is: " }, { knobLabel: "age-value", value: 1 }] + knobs: { age-value: { value: 5 }} => my age is: 5
function getChildrenString(children, knobs) {
  return children.reduce((acc, child) => {
    // If a value wasn't set for this child we treat it as empty string
    const childValue = hasValueSet(child, knobs) ? getFieldValue(child, knobs) : '';

    return `${acc}${childValue}`;
  }, '');
}

function getFieldValue(field, knobs) {
  if (hasKnobValue(field, knobs)) {
    return knobs[field.knobLabel].value;
  }

  return field.value;
}

function hasKnobValue(field, knobs) {
  if (!knobs || !field.knobLabel) {
    return false;
  }

  return knobs.hasOwnProperty(field.knobLabel) && hasValueSet(knobs[field.knobLabel]);
}

// A field descriptor (both in knobs and in our props / children schema) that has no value set doesn't have a 'value' field.
// Checking the existence of this field and not a falsy value of the field since falsy values are also acceptable default values.
function hasValueSet(item, knobs) {
  return item.hasOwnProperty('value') || (knobs && hasKnobValue(item, knobs));
}

function isDefaultValue(prop, currentValue) {
  // If there isn't an explicit definition of a default value, a falsy value will be considered as the default value
  if (!prop || !prop.defaultValue) {
    return !currentValue;
  }

  const defaultValueString = getDefaultValueString(prop.type.name, prop.defaultValue.value);

  return defaultValueString === JSON.stringify(currentValue);
}

function getDefaultValueString(type, defaultValue) {
  // if the default value is a special type that needs to be evaluated
  const objectTypes = ['object', 'array', 'objectOf', 'arrayOf'];
  if (objectTypes.includes(type)) {
    const defaultValueEval = tryToEvalValue(defaultValue);
    if (defaultValueEval) {
      return JSON.stringify(defaultValueEval);
    }
  }

  // fallback to normal string value and normalize the wrapping quotes
  return normalizeWrappingQuotes(defaultValue);
}

/**
 * Try to evaluate the value string. returns undefined if failed
 * @param value - js string
 */
function tryToEvalValue(value) {
  let defaultValueEval;
  try {
    defaultValueEval = eval(value);
  } catch (e) {
    // failed to eval the value
  }

  return defaultValueEval;
}

// String values are sometimes wrapped with single quotes and sometimes with double.
// We want to normalize all these quotes to be double quotes.
function normalizeWrappingQuotes(string) {
  if (!string) {
    return string;
  }

  // If the first and last characters don't match, don't change the value
  if (string[0] !== string.slice(-1)) {
    return string;
  }

  if (string[0] === "'") {
    return `"${string.slice(1, -1)}"`;
  }

  return string;
}

function getPropValueString(propValue) {
  if (typeof propValue === 'object') {
    return JSON.stringify(propValue).replace(/"/g, "'");
  }

  return propValue.toString();
}

module.exports = {
  getChildrenString,
  getFieldValue,
  getPropValueString,
  hasValueSet,
  isDefaultValue
};
