const t = require('@babel/types');
const traverse = require('@babel/traverse').default;
const { getStorySubject, vueTemplateCompilerTypes } = require('../../metadata/utils/vue/story-subject');
const { INJECTED_SOURCE_PLACEHOLDER } = require('../../addons/constants');
const { getAvailableKnobsFunctions, isKnownKnobMethodCall, extractKnobProperties } = require('../analyze-knobs-utils');
const parser = require('../../metadata/parser');

const DUMMY_OBJECT_INIT = 'let dummyObject =';

/**
 * Get's the metadata that was built for each story and extract structured information
 * that is needed to later build the sample code string.
 * @param storyMetadata - as created by the story source analyzer
 * @return object representing the sample code for this story
 */
module.exports = function(storyMetadata, logger) {
  try {
    if (!storyMetadata.frameworkMetadata || !storyMetadata.frameworkMetadata.storyTemplate) {
      return null;
    }

    // we trim storyTemplate since the template parser's start and end values appear to be based on a trimmed version
    // of the template (as demonstrated also in astexplorer, link above)
    storyMetadata.frameworkMetadata.storyTemplate = storyMetadata.frameworkMetadata.storyTemplate.trim();

    const storyTemplate = storyMetadata.frameworkMetadata.storyTemplate;
    const storySubject = getStorySubject(storyTemplate, storyMetadata.dsmInfo);

    if (!storySubject) {
      return null;
    }

    const availableKnobsFunctions = getAvailableKnobsFunctions(storyMetadata.importDeclarations);
    const storyLevelPropsWithKnobs = getStoryLevelPropsWithKnobs(
      storyMetadata.frameworkMetadata.storyLevelProps,
      availableKnobsFunctions
    );

    return {
      componentName: storySubject.tag,
      props: getProps(storySubject, storyLevelPropsWithKnobs),
      children: getChildrenSource(storySubject.children, storyTemplate, storyLevelPropsWithKnobs),
      sourceTemplate: getSourceTemplate(storyTemplate, storySubject)
    };
  } catch (e) {
    logger &&
      logger.error(
        `Failed to analyze sample code for story ${storyMetadata ? `${storyMetadata.kind} - ${storyMetadata.name}` : ''}
        ${e.stack}`
      );
    return null;
  }
};

function getProps(storySubject, storyLevelPropsWithKnobs) {
  const { attrsList, attrsMap } = storySubject;
  const collectedProps = {};

  // regular attributes (name=value) will be all be in attrsList
  const props = attrsList.map((attribute) => {
    collectedProps[attribute.name] = true;
    return extractPropValue(attribute, storyLevelPropsWithKnobs);
  });

  // we also take a look at the attributes in attrsMap, where we can find, in addition, attributes with no value
  // attributes that appear only here and not in attrsList are value-less attributes
  Object.keys(attrsMap).forEach((key) => {
    // if this is a prop missing from attrList, it is a "v-" special vue attributes with no value (ie "v-slot:header"),
    // and we want to add it as is to the sample code as well
    if (!collectedProps[key]) {
      if (attrsMap[key] === '') {
        props.push({ name: key });
      } else {
        // to account for: v-bind:class="{...}" which will not be in attrsList
        const attribute = { name: key, value: attrsMap[key] };
        props.push(extractPropValue(attribute, storyLevelPropsWithKnobs));
      }
    }
  });

  return props;
}

function findBindingToStoryPropWithKnob(storyPropName, storyLevelPropsWithKnobs) {
  return storyLevelPropsWithKnobs.find((prop) => {
    return prop.storyPropName === storyPropName;
  });
}

function extractPropValue(attribute, storyLevelPropsWithKnobs) {
  const isBindingAttribute = attribute.name.startsWith(':') || attribute.name.startsWith('v-bind:');
  if (!isBindingAttribute) {
    return {
      name: attribute.name,
      value: attribute.value
    };
  }

  // we have a prop with binding, v-bind:titleColor or :titleColor (":" is shorthand for v-bind)
  const boundPropKnobsInfo = findBindingToStoryPropWithKnob(attribute.value, storyLevelPropsWithKnobs);
  if (boundPropKnobsInfo) {
    // we want the part to the right of the semicolon (titleColor)
    const name = attribute.name.split(':')[1];
    return {
      name: name,
      value: boundPropKnobsInfo.value,
      knobLabel: boundPropKnobsInfo.knobLabel
    };
  } else {
    return {
      name: attribute.name,
      value: attribute.value
    };
  }
}

function getSourceTemplate(storyTemplate, storySubject) {
  const subjectPrefix = getSourceSubstring(storyTemplate, 0, storySubject.start);
  const subjectPostfix = getSourceSubstring(storyTemplate, storySubject.end);
  return `${subjectPrefix}${INJECTED_SOURCE_PLACEHOLDER}${subjectPostfix}`;
}

/**
 * if property node has a structure that matches a knob property and it has a default property - return the default value
 * eg. { type: String, default: text('title', 'Hello') }
 */
function findKnobPropertyDefaultValue(propertyNode) {
  const valueIsObject = propertyNode.value && t.isObjectExpression(propertyNode.value);
  if (!valueIsObject) {
    return;
  }

  // an example of property value of type object which we are looking for: { default: text('title', 'Hello') }
  const valueObjectProperties = propertyNode.value.properties;
  const defaultValueProp = getPropertyByKeyName(valueObjectProperties, 'default');
  return defaultValueProp && defaultValueProp.value;
}

function getPropertyByKeyName(properties, key) {
  return properties.find((prop) => {
    return prop.key.name === key;
  });
}

function getStoryLevelPropsWithKnobs(storyLevelProps, availableKnobsFunctions) {
  if (!storyLevelProps) {
    return [];
  }

  const storyPropsWithKnobs = [];

  // To make this block a valid javascript statement we add variable initialisation with the content of storyLevelProps object
  // (avoiding parsing error due to usage of `default`)
  // Example:
  // "let dummyObject = { type: 'primary', textKnob: { default: text('title', 'Hello') }, colorKnob: { default: color('title-color', 'pink') }};"
  const ast = parser(DUMMY_OBJECT_INIT + storyLevelProps);
  traverse(ast, {
    ObjectProperty(path) {
      const propertyNode = path.node;
      const knobDefault = findKnobPropertyDefaultValue(propertyNode);
      if (knobDefault && t.isCallExpression(knobDefault)) {
        if (isKnownKnobMethodCall(knobDefault, availableKnobsFunctions)) {
          const knobParams = extractKnobProperties(knobDefault);
          storyPropsWithKnobs.push(
            Object.assign(
              {
                storyPropName: propertyNode.key.name
              },
              knobParams
            )
          );
        }
      }
    }
  });

  return storyPropsWithKnobs;
}

function getChildrenSource(children, storyTemplate, storyLevelPropsWithKnobs) {
  if (children.length === 0) {
    return [];
  }

  const childrenValues = [];
  children.forEach((child) => {
    if (child.type !== vueTemplateCompilerTypes.expression || child.tokens.length === 0) {
      childrenValues.push({
        value: getSourceSubstring(storyTemplate, child.start, child.end)
      });
    } else {
      const bindingTokens = child.tokens;
      bindingTokens.forEach((token) => {
        const binding = token['@binding'];
        if (!binding) {
          childrenValues.push({
            value: `${token}`
          });
        } else {
          const boundPropKnobsInfo = findBindingToStoryPropWithKnob(binding, storyLevelPropsWithKnobs);
          if (boundPropKnobsInfo) {
            childrenValues.push({
              value: boundPropKnobsInfo.value,
              knobLabel: boundPropKnobsInfo.knobLabel
            });
          } else {
            childrenValues.push({
              value: `{{${binding}}}`
            });
          }
        }
      });
    }
  });

  return childrenValues;
}

function getSourceSubstring(storyTemplate, start, end) {
  return storyTemplate.substring(start, end);
}
