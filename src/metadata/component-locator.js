const fsPath = require('path');
const fs = require('fs-extra');
const get = require('lodash/get');
const forEach = require('lodash/forEach');

const KNOWN_COMPONENT_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx'];

/**
 * Attempt to locate the location on disk for a component referenced in a story
 * */
function resolveFromComponentName(componentName, dsmInfo = {}, path, storySourcePath) {
  if (!componentName) {
    return;
  }

  const bindings = get(path, 'scope.bindings') || {};
  const componentPath = getPathDeclaration(dsmInfo, bindings, componentName);
  if (!componentPath) {
    return;
  }
  return resolveFromComponentPath(storySourcePath, componentPath);
}

function getPathDeclaration(dsmInfo, bindings, componentName) {
  // an explicit path was specified in the story "in-dsm" object
  if (dsmInfo.componentPath) {
    return dsmInfo.componentPath;
  }

  // import OR require respectively
  return (
    get(bindings[componentName], 'path.parent.source.value') ||
    get(bindings[componentName], 'path.node.init.object.arguments["0"].value')
  );
}

function resolveFromComponentPath(storySourcePath, componentPath) {
  if (!componentPath) {
    return null;
  }
  let resolvedComponentPath = fsPath.resolve(fsPath.parse(storySourcePath).dir, componentPath);

  // the import of a component is specifying the folder implies the component filename is index.js|ts
  // "import Button from './folder'" => implies structure ./folder/index.js|ts
  const exists = fs.existsSync(resolvedComponentPath);
  if (exists) {
    const fileStats = fs.lstatSync(resolvedComponentPath);
    if (fileStats.isDirectory()) {
      resolvedComponentPath = fsPath.join(resolvedComponentPath, 'index');
    } else if (fileStats.isFile()) {
      return resolvedComponentPath;
    }
  }

  let foundFile = null;
  forEach(KNOWN_COMPONENT_EXTENSIONS, (extension) => {
    const fullFileName = `${resolvedComponentPath}.${extension}`;
    if (fs.existsSync(fullFileName)) {
      foundFile = fullFileName;
      return false;
    }
  });
  return foundFile;
}

module.exports = {
  resolveFromComponentName,
  resolveFromComponentPath
};
