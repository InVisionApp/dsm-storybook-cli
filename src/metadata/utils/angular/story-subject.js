// https://astexplorer.net/ (select HTML and angular to get this parser)
// Parses a template into render3 `Node`s using angular compiler package, we later use r3 types to understand
// the generated AST
const compiler = require('@angular/compiler');
const { parseTemplate } = compiler;

// TODO Angular: we should be able to infer the main component tag by looking at the selector in docgen info (in dsmInfo.docgenInfo.component.selector) -
//  maybe we could use that in case component wasn't sent in in-dsm, instead of defaulting to the first element in the hierarchy
function getStorySubject(storyTemplate, dsmInfo) {
  const explicitStorySubject = dsmInfo.component;
  const ast = getAst(storyTemplate);
  if (!ast || !ast.nodes || ast.nodes.length === 0) {
    return null;
  }

  const singleRootInTemplate = ast.nodes.length === 1;
  let storySubject;

  if (!explicitStorySubject && !singleRootInTemplate) {
    throw 'Template contains multiple root elements; component name must be provided as `component` option in in-dsm object';
  }

  // if we have no single root, we create a fake one, so traversal logic is the same
  if (!singleRootInTemplate) {
    storySubject = {
      name: '____fake-root____',
      children: ast.nodes
    };
  } else {
    storySubject = ast.nodes[0];
  }

  if (explicitStorySubject && storySubject.name !== explicitStorySubject) {
    storySubject = findComponentByTagName(storySubject, explicitStorySubject);
  }

  return storySubject;
}

/**
 * Recursively search the AST of a template for the component with the requested tag name
 * @return relevant node or nothing if not found
 */
function findComponentByTagName(node, name) {
  if (node.name) {
    if (node.name === name) {
      return node;
    }

    let component;
    for (let child of node.children) {
      component = findComponentByTagName(child, name);
      if (component) {
        break;
      }
    }

    return component;
  }
}

function getAst(storyTemplate) {
  return parseTemplate(storyTemplate, '', {}, '');
}

function getComponentTagName(storyTemplate, dsmInfo) {
  const storySubject = getStorySubject(storyTemplate, dsmInfo);
  if (!storySubject) {
    return null;
  }
  return storySubject.name;
}

module.exports = {
  getStorySubject,
  getComponentTagName
};
