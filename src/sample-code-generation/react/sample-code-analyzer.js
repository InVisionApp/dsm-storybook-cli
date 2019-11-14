const t = require('@babel/types');
const { get } = require('lodash');
const { getStorySubject } = require('../../metadata/utils/react/story-subject');
const { INJECTED_SOURCE_PLACEHOLDER } = require('../../addons/constants');
const { getAvailableKnobsFunctions, isKnownKnobMethodCall, extractKnobProperties } = require('../analyze-knobs-utils');

/**
 * Get's the metadata that was built for each story and extract structured information
 * that is needed to later build the sample code string.
 * @param storyMetadata - as created by the story source analyzer
 * @return object representing the sample code for this story
 */
module.exports = function(storyMetadata, logger) {
  try {
    const storySubject = getStorySubject(storyMetadata.frameworkMetadata.returnStatement, storyMetadata.dsmInfo);

    if (!storySubject) {
      return null;
    }

    const availableKnobsFunctions = getAvailableKnobsFunctions(storyMetadata.importDeclarations);
    const returnStatement = storyMetadata.frameworkMetadata.returnStatement;

    return {
      componentName: storySubject.openingElement.name.name,
      props: getProps(returnStatement, storySubject, availableKnobsFunctions),
      children: getChildrenSource(storySubject.children, returnStatement, availableKnobsFunctions),
      sourceTemplate: getSourceTemplate(returnStatement, storySubject)
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

function getProps(returnStatement, storySubject, availableKnobsFunctions) {
  return storySubject.openingElement.attributes.map((attribute) => {
    return getProp(attribute, availableKnobsFunctions, returnStatement);
  });
}

function getProp(attribute, availableKnobsFunctions, returnStatement) {
  if (t.isJSXSpreadAttribute(attribute)) {
    return {
      value: returnStatement.substring(attribute.start, attribute.end),
      isExpression: true
    };
  }

  const name = get(attribute, 'name.name');
  let propValue = extractPropValue(attribute.value, availableKnobsFunctions, returnStatement);

  return {
    name,
    ...propValue
  };
}

function extractPropValue(attributeValue, availableKnobsFunctions, returnStatement) {
  if (t.isStringLiteral(attributeValue)) {
    return {
      value: attributeValue.value
    };
  }

  if (!t.isJSXExpressionContainer(attributeValue)) {
    return {};
  }

  const expressionContainerContent = attributeValue.expression;

  // If the story uses an identifier to determine the prop value, keep that variable name in the sample code
  if (t.isIdentifier(expressionContainerContent)) {
    return {
      value: expressionContainerContent.name,
      isExpression: true
    };
  }

  // If this is a call to a knob function, extract both default value and the knob label
  if (isKnownKnobMethodCall(expressionContainerContent, availableKnobsFunctions)) {
    return extractKnobProperties(expressionContainerContent);
  }

  // This is some other expression, extract it as-is
  return {
    value: getSourceSubstring(returnStatement, expressionContainerContent.start, expressionContainerContent.end),
    isExpression: true
  };
}

function getSourceTemplate(returnStatement, storySubject) {
  const subjectPrefix = getSourceSubstring(returnStatement, 0, storySubject.start);
  const subjectPostfix = getSourceSubstring(returnStatement, storySubject.end);
  return `${subjectPrefix}${INJECTED_SOURCE_PLACEHOLDER}${subjectPostfix}`;
}

function getChildrenSource(children, returnStatement, availableKnobsFunctions) {
  if (children.length === 0) {
    return [];
  }

  return children.map((child) => {
    // Handle knob calls
    if (t.isJSXExpressionContainer(child) && isKnownKnobMethodCall(child.expression, availableKnobsFunctions)) {
      return extractKnobProperties(child.expression);
    }

    return {
      value: getSourceSubstring(returnStatement, child.start, child.end)
    };
  });
}

function getSourceSubstring(returnStatement, start, end) {
  return returnStatement.substring(start, end);
}
