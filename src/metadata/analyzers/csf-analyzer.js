const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const { get, setWith, startCase } = require('lodash');
const logger = require('../../cli/cli-logger');
const { inDsmInitLocationError } = require('../../user-messages');
const getFrameworkAnalyzer = require('../framework-analyzers').getFrameworkAnalyzer;
const resolveDsmInfo = require('../resolve-dsm-info');
const validateDsmInfo = require('../validate-dsm-info');
const { objectExpressionToJsObject, findPropertyNodeByKey, isFunction } = require('../utils/ast-utils.js');
const {
  getDsmInfo,
  extractMetadata,
  extractDocgenInfo,
  addImportDeclaration,
  addRequireDeclaration,
  formatErrorMessage
} = require('./analyzer-utils.js');

/**
 * Analyzer that analysis Storybook '.stories' files that are structured with the 'CSF' (Component Story Format) format
 * This format was introduced in Storybook 5.2
 **/
function analyze(ast, storyFileSource, storyFilePath, framework) {
  const {
    importDeclarations,
    exportDeclarations,
    storiesParameters,
    storyCandidates,
    kind,
    globalDsmInfo,
    globalCustomDsmInfoIncorrectInitLocation
  } = collectData(ast);

  // Not a valid stories file
  if (!kind) {
    return { importDeclarations, dsmStoriesData: [] };
  }

  if (globalCustomDsmInfoIncorrectInitLocation) {
    warnInDsmInitLocationError(IN_DSM_LEVELS.moduleLevel, kind);
  }

  const frameworkAnalyzer = getFrameworkAnalyzer(framework);

  const dsmStoriesData = storyCandidates.reduce((acc, storyCandidate) => {
    const { customName, customDsmInfo, customDsmInfoIncorrectInitLocation } = storiesParameters[storyCandidate.name] || {};
    // in CSF the story name is the variable declaration string that is formatted to 'Start Case'
    const storyName = startCase(storyCandidate.name);
    if (customDsmInfoIncorrectInitLocation) {
      warnInDsmInitLocationError(IN_DSM_LEVELS.storyLevel, kind, storyName);
    }
    const dsmInfo = customDsmInfo ? { ...(globalDsmInfo || {}), ...customDsmInfo } : globalDsmInfo;
    if (!dsmInfo || !exportDeclarations.includes(storyCandidate.name)) {
      return acc;
    }

    const validationResult = validateDsmInfo(dsmInfo, storyName, kind, frameworkAnalyzer.validateDsmInfo);
    if (!validationResult.isValid) {
      return acc;
    }

    const storyData = {
      externalComponentId: dsmInfo.id,
      kind: kind,
      name: storyName,
      dsmInfo: resolveDsmInfo(dsmInfo, storyFilePath)
    };

    if (customName) {
      storyData.displayName = customName;
    }

    const storyPath = { scope: storyCandidate.scope, node: storyCandidate.storyNode };
    extractMetadata(storyData, frameworkAnalyzer, storyPath, storyFilePath, storyFileSource, storyName, kind);
    extractDocgenInfo(storyData, frameworkAnalyzer, storyPath, storyFilePath, storyFileSource, storyName, kind, dsmInfo);

    acc.push(storyData);
    return acc;
  }, []);

  return { importDeclarations: importDeclarations, dsmStoriesData };
}

function collectData(ast) {
  const collectedData = {
    importDeclarations: [],
    storyCandidates: [],
    exportDeclarations: [],
    storiesParameters: {},
    kind: null,
    globalDsmInfo: null,
    globalCustomDsmInfoIncorrectInitLocation: false
  };

  traverse(ast, {
    // Each variable declaration that is initialized with a function is a story candidate
    // Example:
    // const test1 = () => <Button onClick={action('clicked')}>Button Test 1</Button>; // Story candidate
    // const dummyVar = `I'm a string!`; // Not a story
    VariableDeclarator(path) {
      if (isFunction(path.node.init)) {
        collectedData.storyCandidates.push({
          name: path.node.id.name,
          storyNode: path.node.init,
          scope: path.scope
        });
      }

      // detect "require(...)"
      addRequireDeclaration(path, collectedData.importDeclarations);
    },
    // detect import declarations "import '...'"
    ImportDeclaration(path) {
      addImportDeclaration(path, collectedData.importDeclarations);
    },
    // Get Stories kind (metadata) (equivalent to storiesOf) and extract the global dsmInfo for the entire stories in the file
    // Example:
    // export default {
    //   title: 'Something|SB Button/Doc/Lol', // the kind of the stories
    //   parameters: { component: Button, 'in-dsm': { id: '5ce17c934d0426001d9d3596' } } // global 'in-dsm' declaration
    // };
    ExportDefaultDeclaration(path) {
      const { declaration } = path.node;
      collectedData.globalCustomDsmInfoIncorrectInitLocation = !!getDsmInfo(declaration);
      collectedData.globalDsmInfo = getDsmInfo(declaration, { parentPropertyKey: 'parameters' });
      collectedData.kind = getKind(declaration);
    },
    // Collecting all exported variables to identify the real stories in the storyCandidates array
    // Only stories should/are allowed to be exported in a '.stories' file
    ExportNamedDeclaration(path) {
      if (path.node.declaration) {
        const storyNode = get(path, 'node.declaration.declarations[0]');
        if (storyNode && isFunction(storyNode.init)) {
          collectedData.exportDeclarations.push(storyNode.id.name);
        }
      }
    },
    // Collection all exported variables - same as ExportNamedDeclaration
    ExportSpecifier(path) {
      collectedData.exportDeclarations.push(path.node.local.name);
    },
    // Extracting story level custom parameters
    // Example:
    // Option #1
    // test1.story = { name: 'test 1', 'in-dsm': { id: '5ce17ca24d0426001d9d3599', version: '1.0.66' } };
    // Option #2
    // test3.story = {};
    // test3.story.name = 'Test 3';
    // test3.story['in-dsm'] = { id: '5ce17ca24d0426001d9d3599', version: '1.0.33' };
    AssignmentExpression(path) {
      const { left, right } = path.node;
      const { storyName, path: setPath } = extractStoryParametersAssignmentPath(left);
      if (storyName) {
        const { customName, customDsmInfo, customDsmInfoIncorrectInitLocation } = extractStoryLevelCustomParameters(
          setPath,
          right
        );
        const oldCustomData = collectedData.storiesParameters[storyName] || {};

        collectedData.storiesParameters[storyName] = {
          customName: customName || oldCustomData.customName,
          customDsmInfo: customDsmInfo ? { ...oldCustomData.customDsmInfo, ...customDsmInfo } : oldCustomData.customDsmInfo,
          customDsmInfoIncorrectInitLocation:
            customDsmInfoIncorrectInitLocation || oldCustomData.customDsmInfoIncorrectInitLocation
        };
      }
    }
  });

  return collectedData;
}

function extractStoryLevelCustomParameters(setPath, right) {
  const setPathWithPrefix = setPath ? `data.${setPath}` : 'data';
  const tempParametersObject = setWith({}, setPathWithPrefix, getAssignmentValue(right), Object);
  const customName = get(tempParametersObject, 'data.name');
  const customDsmInfo = get(tempParametersObject, 'data.parameters["in-dsm"]');
  const customDsmInfoIncorrectInitLocation = !!get(tempParametersObject, 'data["in-dsm"]');

  return { customName, customDsmInfo, customDsmInfoIncorrectInitLocation };
}

function getAssignmentValue(node) {
  if (t.isObjectExpression(node)) {
    const throwOnUnknownTypes = false;
    return objectExpressionToJsObject(node, throwOnUnknownTypes);
  }
  if (t.isLiteral(node)) {
    return node.value;
  }

  return null;
}

/**
 * Extracts the root variable name of the assignment and the assignment path
 * Example:
 * For 'myStory.story.parameters = { 'in-dsm': { id: '123' } }' we'll receive { storyName: 'myStory', path: 'parameters'}
 **/
function extractStoryParametersAssignmentPath(node, path = '') {
  if (!t.isMemberExpression(node)) {
    return {};
  }

  const { property, object } = node;
  const propKey = getPropertyKey(property);
  if (!propKey) {
    return {};
  }

  if (propKey === 'story' && t.isIdentifier(object)) {
    return { storyName: getPropertyKey(object), path };
  }

  if (t.isIdentifier(object)) {
    return {};
  }

  if (path) {
    path = propKey.concat('.', path);
  } else {
    path = propKey;
  }

  return extractStoryParametersAssignmentPath(object, path);
}

function getPropertyKey(prop) {
  // if the property is a MemberExpression we do not support it
  // Example:
  // const something = { testing: '1234' };
  // test3.story.parameters[something.testing] = { name: 'something' };
  if (t.isMemberExpression(prop)) {
    return null;
  }
  return prop.name || prop.value;
}

function getKind(node) {
  if (!node.properties) {
    return null;
  }

  const nameNode = findPropertyNodeByKey(node, 'title');
  return get(nameNode, 'value.value');
}

const IN_DSM_LEVELS = { moduleLevel: 'Module-Level', storyLevel: 'Story-Level' };

function warnInDsmInitLocationError(inDsmLevel, kind, storyName) {
  logger.warning(formatErrorMessage(inDsmInitLocationError(inDsmLevel), kind, storyName));
}

module.exports = { analyze };
