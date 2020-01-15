// 'vue-template-compiler' is coming from 'vue-docgen-api' package as a dependency of it
// AST https://ktsn.github.io/vue-ast-explorer/
// template explorer: https://template-explorer.vuejs.org
const compiler = require('vue-template-compiler');

// https://astexplorer.net/ (select HTML and vue to get this parser)
const vueTemplateCompilerTypes = {
  component: 1,
  expression: 2,
  string: 3
};

function getStorySubject(storyTemplate, dsmInfo) {
  const ast = getAst(storyTemplate);
  if (!ast) {
    return null;
  }

  let storySubject = ast;
  const explicitStorySubject = dsmInfo.component;

  if (explicitStorySubject && storySubject.tag !== explicitStorySubject) {
    storySubject = findComponentByTagName(storySubject, explicitStorySubject);
  }

  return storySubject;
}

/**
 * Recursively search the AST of a template for the component with the requested tag name
 * @return relevant node or nothing if not found
 */
function findComponentByTagName(node, name) {
  if (node.type === vueTemplateCompilerTypes.component) {
    if (node.tag === name) {
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
  const compiledTemplate = compiler.compile(storyTemplate, { outputSourceRange: true });
  return compiledTemplate.ast;
}

function getComponentTagName(storyTemplate, dsmInfo) {
  const storySubject = getStorySubject(storyTemplate, dsmInfo);
  if (!storySubject) {
    return null;
  }
  return storySubject.tag;
}

module.exports = {
  getStorySubject,
  getComponentTagName,
  vueTemplateCompilerTypes
};
