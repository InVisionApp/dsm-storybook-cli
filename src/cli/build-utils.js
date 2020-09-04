const fs = require('fs-extra');
const rimraf = require('rimraf');
const shell = require('shelljs');
const path = require('path');
const logger = require('./cli-logger');
const userMessages = require('../user-messages');
const { environmentKeys } = require('../services/configuration');
const { STORYBOOK_ENV_VARIABLE } = require('../addons/constants');
const { STORYBOOK_BUILD_FOLDER } = require('./constants');

const STORY_METADATA_FILENAME = 'story-metadata.json';

function writeStoryMetadata(storyMetadata, options) {
  const fileName = path.resolve(options.appDirectory, options.outputDir, 'metadata', STORY_METADATA_FILENAME);
  fs.outputJsonSync(fileName, storyMetadata);
  logger.info(userMessages.analysisWritten(fileName));
}

/**
 * Build the storybook with DSM options
 * */
function buildStorybook(options, customArgs) {
  const runConfiguration = {
    [environmentKeys.dsmProdEnvironment]: true,
    [environmentKeys.dsmHost]: options.dsmHost,
    [environmentKeys.storybookFramework]: options.storybookFramework,
    [environmentKeys.storybookVersion]: options.storybookVersion,
    [environmentKeys.isUsingDeclarativeConfiguration]: options.isUsingDeclarativeConfiguration
  };
  const outputDir = path.join(options.outputDir, STORYBOOK_BUILD_FOLDER);

  const cmd = buildCommand(runConfiguration, options.nodeModulesPath, 'build-storybook', `-o ${outputDir}`, customArgs);

  logger.info(userMessages.creatingStorybookBundle());
  return executeCommand(cmd);
}

function runStorybook(options, customArgs, previewServerPort) {
  const runConfiguration = {
    [environmentKeys.previewServerPort]: previewServerPort,
    [environmentKeys.dsmHost]: options.dsmHost,
    [environmentKeys.storybookFramework]: options.storybookFramework,
    [environmentKeys.storybookVersion]: options.storybookVersion,
    [environmentKeys.isUsingDeclarativeConfiguration]: options.isUsingDeclarativeConfiguration
  };

  const cmd = buildCommand(runConfiguration, options.nodeModulesPath, 'start-storybook', customArgs);

  // start the shell in async mode so that we can continue to run the CLI server
  return executeCommand(cmd, { async: true });
}

function executeCommand(cmd, options = {}) {
  return shell.exec(cmd, options).code === 0;
}

function buildCommand(runConfiguration, nodeModulesPath, script, ...options) {
  const scriptPath = path.resolve(nodeModulesPath, '.bin', script);
  const cmdScriptPath = path.resolve(nodeModulesPath, '.bin', `${script}.cmd`);
  // .cmd files are only on windows machines, they are for running node on windows as it's different from Mac
  const runScript = fs.pathExistsSync(cmdScriptPath) ? cmdScriptPath : `node ${scriptPath}`;
  const crossEnvScriptPath = path.resolve(nodeModulesPath, '.bin', 'cross-env');

  return `${crossEnvScriptPath} ${setEnvironmentVariable(runConfiguration)} ${runScript} ${options.join(' ')}`;
}

function clearOutputFolder({ appDirectory, outputDir }) {
  const toRemove = path.resolve(appDirectory, outputDir);
  rimraf.sync(toRemove);
}

function setEnvironmentVariable(runConfiguration) {
  // Replace all single quotes with escaped double quote so it won't close the single quotes that wrap the environment variable value assignment
  const configurationString = `${JSON.stringify(runConfiguration).replace(/'|"/g, `\\"`)}`;

  return `${STORYBOOK_ENV_VARIABLE}="${configurationString}"`;
}

module.exports = {
  writeStoryMetadata,
  buildStorybook,
  runStorybook,
  clearOutputFolder
};
