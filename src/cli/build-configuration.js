const path = require('path');
const keys = require('lodash/keys');
const logger = require('./cli-logger');
const userMessages = require('../user-messages');
const { getClientPackageJson, getDependencyPackageJson } = require('./package-json-utils');
const { getPrettierConfiguration } = require('./prettier-config-utils');
const getStorybookVersionsInfo = require('./storybook-version-locator');
const getStorybookFramework = require('./storybook-framework-detector');
const loadJsonConfigurationFromFile = require('./json-file-utils');
const { getInstalledPackagePath, CWD_NODE_MODULES_DIRECTORY } = require('./resolve-node-modules');
const { getStorybookConfigPath } = require('./get-storybook-config-path');
const { isUsingDeclarativeConfiguration } = require('./is-using-declarative-configuration');

const STORYBOOK_MODULE_NAME = '@storybook';
const DSM_STORYBOOK_MODULE_NAME = '@invisionapp/dsm-storybook';
const DSM_CONFIG_FILENAME = '.dsmrc';
const configurationKeys = {
  dsmHost: 'dsmHost',
  authToken: 'authToken',
  storyPath: 'storyPath',
  outputDir: 'outputDir',
  hideDsmGeneratedTable: 'hideDsmGeneratedTable',
  defaultDocsTab: 'defaultDocsTab'
};

let loadedConfiguration = null;

function create(commandlineOptions, customArgs) {
  if (loadedConfiguration) {
    logger.error(userMessages.configurationAlreadyLoaded());
    process.exit(1);
  }

  // Infer the application directory from the location of the package.json
  const packageJson = getClientPackageJson();
  const appDirectory = path.dirname(packageJson.path);
  const configFile = path.join(appDirectory, DSM_CONFIG_FILENAME);
  const configuration = loadJsonConfigurationFromFile(configFile, DSM_STORYBOOK_MODULE_NAME);
  const installedStorybookPackagePath = getInstalledPackagePath(STORYBOOK_MODULE_NAME);
  const nodeModulesPath = installedStorybookPackagePath
    ? installedStorybookPackagePath.nodeModulesPath
    : CWD_NODE_MODULES_DIRECTORY;
  const storybookDependencies = getStorybookVersionsInfo(packageJson.pkg, nodeModulesPath);
  const storybookFramework = getStorybookFramework(storybookDependencies, configuration);
  const dsmStorybookVersion = getDsmStorybookPackageVersion();
  const prettierConfiguration = getPrettierConfiguration(appDirectory, packageJson.pkg);
  const { storybookConfigPath, storybookConfigFolderPath } = getStorybookConfigPath(customArgs);

  const appConfiguration = {
    logInformation: { packageJson, dsmRcConfiguration: configuration },
    appDirectory,
    version: packageJson.pkg.version,
    nodeModulesPath,
    storybookDependencies,
    storybookFramework: storybookFramework.name,
    storybookVersion: storybookFramework.version,
    dsmStorybookVersion,
    prettierConfiguration,
    storybookConfigPath,
    storybookConfigFolderPath,
    isUsingDeclarativeConfiguration: isUsingDeclarativeConfiguration(storybookConfigPath),
    isDocsPage: customArgs.includes('--docs')
  };

  const environmentConfiguration = loadEnvironmentVariables();
  loadedConfiguration = mergeConfigurationValues(appConfiguration, commandlineOptions, configuration, environmentConfiguration);
  validateConfiguration();
  return loadedConfiguration;
}

/**
 * finds the version of the dsm-storybook package installed in node_modules
 */
function getDsmStorybookPackageVersion() {
  // first check the version we have in node_modules
  const dsmStorybookPackageJson = getDependencyPackageJson(DSM_STORYBOOK_MODULE_NAME);
  return dsmStorybookPackageJson && dsmStorybookPackageJson.version;
}

function loadEnvironmentVariables() {
  const authToken = process.env.DSM_AUTH_TOKEN;

  return authToken ? { authToken } : {};
}

function mergeConfigurationValues(appConfiguration, cmdConfiguration, fileConfiguration = {}, environmentConfiguration) {
  // The below options are optional and we automatically set them to false. If the
  // user specifies them via the command-line or dsmrc the user options will be
  // overwrite the defaults.
  const optionalCommandLineOptions = {
    [configurationKeys.defaultDocsTab]: false,
    [configurationKeys.hideDsmGeneratedTable]: false
  };

  // command line args overrides config file, default DSM options, and environment variables
  return Object.assign(
    appConfiguration,
    optionalCommandLineOptions,
    fileConfiguration,
    environmentConfiguration,
    cmdConfiguration
  );
}

function get() {
  if (!loadedConfiguration) {
    logger.error(userMessages.configNotReady());
    process.exit(1);
  }
  return loadedConfiguration;
}

function validateConfiguration() {
  if (!loadedConfiguration) {
    logger.error(userMessages.configLoadFailed());
    process.exit(1);
  }
  let hasMissingConfiguration = false;

  keys(configurationKeys).map((key) => {
    const configurationKeyExists = key in loadedConfiguration;
    if (!configurationKeyExists) {
      logger.error(userMessages.missingConfigurationKey(key));
      hasMissingConfiguration = true;
    }
  });
  if (hasMissingConfiguration) {
    logger.error(userMessages.configurationFileNotFound(DSM_CONFIG_FILENAME));
    process.exit(1);
  }
}

module.exports = {
  create,
  get,
  configurationKeys
};
