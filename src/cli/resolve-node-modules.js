const fs = require('fs');
const path = require('path');
const pkgDir = require('pkg-dir');

const CWD = fs.realpathSync(process.cwd());
// The '../' is relative to the current working directory
const MONO_REPO_WD = pkgDir.sync(path.resolve(CWD, '../'));
const CWD_NODE_MODULES_DIRECTORY = path.resolve(CWD, 'node_modules');
const MONO_REPO_WD_NODE_MODULES_DIRECTORY = MONO_REPO_WD && path.resolve(MONO_REPO_WD, 'node_modules');

function getInstalledPackagePath(packageFolderName) {
  let nodeModulesPath = CWD_NODE_MODULES_DIRECTORY;
  let packageResolvedPath = getPackageFolder(nodeModulesPath, packageFolderName);
  if (packageResolvedPath) {
    return { nodeModulesPath, packageResolvedPath };
  }

  nodeModulesPath = MONO_REPO_WD_NODE_MODULES_DIRECTORY;
  packageResolvedPath = nodeModulesPath && getPackageFolder(nodeModulesPath, packageFolderName);
  if (packageResolvedPath) {
    return { nodeModulesPath, packageResolvedPath };
  }

  // Package not found
  return null;
}

function getPackageFolder(nodeModulesPath, packageFolderName) {
  const packagePath = path.resolve(nodeModulesPath, packageFolderName);
  return fs.existsSync(packagePath) ? packagePath : null;
}

module.exports = { getInstalledPackagePath, CWD, MONO_REPO_WD, CWD_NODE_MODULES_DIRECTORY, MONO_REPO_WD_NODE_MODULES_DIRECTORY };
