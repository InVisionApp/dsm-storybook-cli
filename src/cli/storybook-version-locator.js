const path = require('path');
const keys = require('lodash/keys');
const isEmpty = require('lodash/isEmpty');
const unionBy = require('lodash/unionBy');
const logger = require('./cli-logger');
const userMessages = require('../user-messages');
const { getPackageJsonFromPath } = require('./package-json-utils');

function getStorybookVersionsInfo(appPackageJson, nodeModulesPath) {
  const storybookDependencies = getStorybookDependencies(appPackageJson.devDependencies).concat(
    getStorybookDependencies(appPackageJson.dependencies)
  );

  if (isEmpty(storybookDependencies)) {
    logger.error(userMessages.storyboookMissingInPackageJson());
    process.exit(1);
  }

  const installedStorybookPackages = getStorybookInstalledPackages(storybookDependencies, nodeModulesPath);

  if (isEmpty(installedStorybookPackages)) {
    logger.warning(userMessages.storybookMissingInNodeModules());
    return storybookDependencies;
  }

  // show the results from node_modules and if a package is missing from the node_modules fallback to package.json version value.
  return unionBy(installedStorybookPackages, storybookDependencies, 'name');
}

function getStorybookDependencies(dependenciesObject) {
  return dependenciesObject
    ? keys(dependenciesObject)
        .filter((key) => key.startsWith('@storybook'))
        .map((dependencyKey) => ({ name: dependencyKey, version: dependenciesObject[dependencyKey] }))
    : [];
}

function getStorybookInstalledPackages(storybookPackages, nodeModulesPath) {
  return storybookPackages.reduce((packages, { name }) => {
    const installedPackagePath = path.join(nodeModulesPath, name);

    try {
      const packageJson = getPackageJsonFromPath(installedPackagePath);
      packages.push({ name: packageJson.name, version: packageJson.version });
    } catch (e) {
      logger.warning(userMessages.packageMissingInNodeModules(name));
    }

    return packages;
  }, []);
}

module.exports = getStorybookVersionsInfo;
