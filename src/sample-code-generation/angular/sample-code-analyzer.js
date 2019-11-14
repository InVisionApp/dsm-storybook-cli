const _ = require('lodash');
const t = require('@babel/types');
const traverse = require('@babel/traverse').default;
const { getStorySubject } = require('../../metadata/utils/angular/story-subject');
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
    const storyTemplate = storyMetadata.frameworkMetadata && storyMetadata.frameworkMetadata.storyTemplate;
    if (!storyTemplate) {
      return null;
    }

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
      componentName: storySubject.name,
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
  const { attributes, inputs, outputs } = storySubject;

  const props = attributes.map((attribute) => {
    // special handling for directives
    if (!attribute.valueSpan) {
      return { name: attribute.name };
    }
    return {
      name: attribute.name,
      value: attribute.value
    };
  });

  // handle property binding, which will be in "inputs" array
  inputs.forEach((input) => {
    props.push(extractInputPropValue(input, storyLevelPropsWithKnobs));
  });

  // handle event binding, which will be in "outputs" array
  outputs.forEach((output) => {
    props.push({ name: `(${output.name})`, value: output.handler.source });
  });

  return props;
}

function findBindingToStoryPropWithKnob(storyPropName, storyLevelPropsWithKnobs) {
  return storyLevelPropsWithKnobs.find((prop) => {
    return prop.storyPropName === storyPropName;
  });
}

function extractInputPropValue(input, storyLevelPropsWithKnobs) {
  const valueSource = _.get(input, 'value.source');
  if (getNodeType(input) !== 'BoundAttribute') {
    return { name: input.name, value: valueSource };
  }

  // we have a prop with binding (BoundAttribute)
  const boundPropKnobsInfo = findBindingToStoryPropWithKnob(valueSource, storyLevelPropsWithKnobs);
  if (boundPropKnobsInfo) {
    return {
      name: input.name,
      value: boundPropKnobsInfo.value,
      knobLabel: boundPropKnobsInfo.knobLabel
    };
  } else {
    return {
      name: `[${input.name}]`,
      value: valueSource
    };
  }
}

function getSourceTemplate(storyTemplate, storySubject) {
  const subjectPrefix = getSourceSubstring(storyTemplate, 0, storySubject.sourceSpan.start.offset);
  const subjectPostfix = getSourceSubstring(storyTemplate, storySubject.endSourceSpan.end.offset);
  return `${subjectPrefix}${INJECTED_SOURCE_PLACEHOLDER}${subjectPostfix}`;
}

function getStoryLevelPropsWithKnobs(storyLevelProps, availableKnobsFunctions) {
  if (!storyLevelProps) {
    return [];
  }

  const storyPropsWithKnobs = [];

  // To make this block a valid javascript statement we add variable initialisation with the content of storyLevelProps object
  // (avoiding parsing error), example:
  // "let dummyObject = { textKnob: text('title', 'Hello'), colorKnob: color('title-color', 'pink') };"
  const ast = parser(DUMMY_OBJECT_INIT + storyLevelProps);
  traverse(ast, {
    ObjectProperty(path) {
      const propertyNode = path.node;
      const propertyValue = propertyNode.value;
      if (propertyValue && t.isCallExpression(propertyValue)) {
        if (isKnownKnobMethodCall(propertyValue, availableKnobsFunctions)) {
          const knobParams = extractKnobProperties(propertyValue);
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

function getNodeType(node) {
  return node.constructor && node.constructor.name;
}

function getChildrenSource(children, storyTemplate, storyLevelPropsWithKnobs) {
  if (children.length === 0) {
    return [];
  }

  const childrenValues = [];
  children.forEach((child) => {
    const childSourceSpan = _.get(child, 'sourceSpan');
    if (!childSourceSpan) {
      return;
    }

    const childNodeType = getNodeType(child);
    if (childNodeType === 'Element') {
      const startSourceSpanOffset = child.startSourceSpan.start.offset;
      // if the child is a self closing tag it doesn't have an "endSourceSpan" so the end offset is in "startSourceSpan"
      const endSourceSpanOffset = _.get(child, 'endSourceSpan.end.offset') || child.startSourceSpan.end.offset;

      childrenValues.push({
        value: getSourceSubstring(storyTemplate, startSourceSpanOffset, endSourceSpanOffset)
      });

      return;
    } else if (childNodeType === 'BoundText') {
      // BoundText can contain multiple expressions, but for now we support just one for knobs
      const boundTextValue = getBoundTextChildValues(child, storyLevelPropsWithKnobs);
      if (boundTextValue) {
        childrenValues.push(boundTextValue);
        return;
      }
    }

    // if not otherwise handled - we set the child value to the source as it is
    childrenValues.push({
      value: getSourceSubstring(storyTemplate, childSourceSpan.start.offset, childSourceSpan.end.offset)
    });
  });

  return childrenValues;
}

function getBoundTextChildValues(child, storyLevelPropsWithKnobs) {
  const expressions = _.get(child, 'value.ast.expressions');
  if (expressions && expressions.length === 1 && getNodeType(expressions[0]) === 'PropertyRead') {
    const propertyName = expressions[0].name;
    const propKnobsInfo = findBindingToStoryPropWithKnob(propertyName, storyLevelPropsWithKnobs);
    if (propKnobsInfo) {
      return {
        value: propKnobsInfo.value,
        knobLabel: propKnobsInfo.knobLabel
      };
    }
  }
}

function getSourceSubstring(storyTemplate, start, end) {
  return storyTemplate.substring(start, end);
}
