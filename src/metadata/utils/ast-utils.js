const t = require('@babel/types');
const { forEach } = require('lodash');
const userMessage = require('../../user-messages');

const isFunction = (node) => t.isArrowFunctionExpression(node) || t.isFunctionExpression(node);

/**
 * Returns property node by key (= property name) for an object AST node
 */
const findPropertyNodeByKey = (objectNode, keyName) => {
  return objectNode.properties.find((prop) => {
    const key = prop.key.value || prop.key.name;
    return key === keyName;
  });
};

/**
 * Transforms an ObjectExpression node to JavaScript Object
 * @param node - the ObjectExpression node to transform
 * @param throwOnUnknownTypes - flag to indicate if to throw error when trying to transform unknown type
 * @param accumulator
 */
function objectExpressionToJsObject(node, throwOnUnknownTypes = true, accumulator = {}) {
  forEach(node.properties, (prop) => {
    const key = prop.key.value || prop.key.name;
    if (t.isLiteral(prop.value)) {
      accumulator[key] = prop.value.value;
    } else if (t.isIdentifier(prop.value)) {
      accumulator[key] = prop.value.name;
    } else if (t.isObjectExpression(prop.value)) {
      accumulator[key] = objectExpressionToJsObject(prop.value, throwOnUnknownTypes);
    } else if (throwOnUnknownTypes) {
      throw new Error(userMessage.failedToParseInDsmInformation(key, prop.value.type));
    }
  });

  return accumulator;
}

module.exports = { isFunction, findPropertyNodeByKey, objectExpressionToJsObject };
