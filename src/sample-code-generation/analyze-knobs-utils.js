const t = require('@babel/types');
const find = require('lodash/find');

function extractKnobProperties(knobFunctionCall) {
  const knobsFunctionArgs = knobFunctionCall.arguments;

  const knobParams = {
    knobLabel: knobsFunctionArgs[0].value
  };

  const defaultValueIndex = getKnobValueIndex(knobFunctionCall.callee.name);
  if (defaultValueIndex && knobsFunctionArgs.length > defaultValueIndex) {
    knobParams.value = knobsFunctionArgs[defaultValueIndex].value;
  }

  return knobParams;
}

// Since some knob types has different order of parameters, this function is needed to extract the default value.
// This will not work of course if the name of the knob was changed by the story author.
function getKnobValueIndex(knobType) {
  switch (knobType) {
    case 'select':
    case 'radios':
    case 'files':
    case 'optionsKnob':
    case 'options': // Common synonym for optionsKnob
      return 2;
    case 'button':
      // Currently button is not supported since we have no way to get the default result value
      return null;
    default:
      return 1;
  }
}

// Checks if the prop value is a knob call.
// E.g.: propName={text('knob-label', 'default-value')} or propName={text('knob-label')}
function isKnownKnobMethodCall(expressionContainerContent, availableKnobFunctions) {
  if (!t.isCallExpression(expressionContainerContent) || !t.isIdentifier(expressionContainerContent.callee)) {
    return false;
  }

  if (expressionContainerContent.arguments.length === 0) {
    return false;
  }

  return availableKnobFunctions.includes(expressionContainerContent.callee.name);
}

function getAvailableKnobsFunctions(importDeclarations) {
  const knobsImport = find(importDeclarations, { moduleName: '@storybook/addon-knobs' });

  if (!knobsImport) {
    return [];
  }

  return knobsImport.bindings;
}

module.exports = {
  getAvailableKnobsFunctions,
  isKnownKnobMethodCall,
  extractKnobProperties
};
