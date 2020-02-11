const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const parser = require('../../parser');
const get = require('lodash/get');

function getStorySubject(returnStatement, dsmInfo) {
  const ast = getAst(returnStatement);
  if (!ast) {
    return null;
  }

  const storySubjectPredicate = getStorySubjectPredicate(dsmInfo);
  let storySubject = null;

  traverse(ast, {
    JSXElement(path) {
      const elementName = get(path, 'node.openingElement.name.name');
      if (!elementName) {
        return;
      }

      if (storySubjectPredicate(elementName)) {
        storySubject = path.node;
        path.stop();
      }
    }
  });

  return storySubject;
}

function getAst(returnStatement) {
  const ast = parser(returnStatement);
  return hasValidProgramBody(ast) ? ast : null;
}

// Make sure our ast starts with a top level JSX element
function hasValidProgramBody(ast) {
  if (!ast) {
    return false;
  }

  const firstNode = get(ast, 'program.body[0]');
  return t.isExpressionStatement(firstNode) && isJSXNode(firstNode);
}

function isJSXNode(node) {
  return t.isJSXElement(node.expression) || t.isJSXFragment(node.expression);
}

// By default, we search for the top level custom component (== starts with an uppercase letter).
// If the info objects explicitly states the name of the component, we use it instead.
function getStorySubjectPredicate(dsmInfo) {
  const explicitStorySubject = dsmInfo.component;
  if (explicitStorySubject) {
    return (name) => name === explicitStorySubject;
  }

  // React Fragment is not a valid StorySubject
  return (name) => name[0] !== name[0].toLowerCase() && name !== 'Fragment';
}

function getComponentName(returnStatement, dsmInfo) {
  const storySubject = getStorySubject(returnStatement, dsmInfo);
  if (!storySubject) {
    return null;
  }
  return storySubject.openingElement.name.name;
}

module.exports = {
  getStorySubject,
  getComponentName
};
