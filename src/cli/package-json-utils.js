const readPkgUp = require('read-pkg-up');
const readPkg = require('read-pkg');
const logger = require('./cli-logger');
const { getInstalledPackagePath, CWD } = require('./resolve-node-modules');
const userMessages = require('../user-messages');

// Find the package.json using the current working directory as the starting location
function getClientPackageJson() {
  const packageJson = getPackageJson();
  if (!isPackageJsonFound(packageJson)) {
    logger.error(userMessages.projectRootNotFound());
    process.exit(1);
  }

  return packageJson;
}

function isPackageJsonFound(packageJson) {
  return packageJson && packageJson.path;
}

/**
 * Get the nearest package.json from the process directory.
 * */
function getPackageJson() {
  return readPkgUp.sync({ cwd: CWD });
}

/**
 * Get the package.json from the path provided
 */
function getPackageJsonFromPath(pkgPath) {
  return readPkg.sync({ cwd: pkgPath });
}

/**
 * Get the package.json of a dependency from node_modules if it exists, or undefined if not
 */
function getDependencyPackageJson(installedPackageName) {
  let installedPath = getInstalledPackagePath(installedPackageName);
  return installedPath ? readPkg.sync({ cwd: installedPath.packageResolvedPath }) : null;
}

module.exports = { getClientPackageJson, getPackageJsonFromPath, getDependencyPackageJson };
