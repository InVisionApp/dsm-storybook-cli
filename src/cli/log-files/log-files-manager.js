const glob = require('glob');
const path = require('path');
const fs = require('fs-extra');
const rimraf = require('rimraf');
const { get } = require('lodash');
const { resolveFromComponentPath } = require('../../metadata/component-locator');

const LOGS_FOLDER = 'logs';

let initialized = false;
let options = {};
let LOGS_PATH;
let STORYBOOK_CONFIGURATION_PATH;
const CONFIG_DIRECTORY_FILES = [];

function initializeLogManager(appConfigurations) {
  options = appConfigurations;
  LOGS_PATH = path.resolve(options.appDirectory, options.outputDir, LOGS_FOLDER);
  const { storybookConfigPath } = options;
  if (storybookConfigPath) {
    STORYBOOK_CONFIGURATION_PATH = path.resolve(options.appDirectory, storybookConfigPath, '../*');
    const configDirectoryFilesPaths = glob.sync(STORYBOOK_CONFIGURATION_PATH);
    configDirectoryFilesPaths.forEach((filePath) => {
      CONFIG_DIRECTORY_FILES.push({
        title: `FILE: ${filePath}`,
        data: readFile(filePath)
      });
    });
  }

  clearOldLogFolder();

  initialized = true;
}

/**
 * Creates '{story-file-name}.error' log file with all the data we can get
 * The logs will be written to <outputDir>/logs
 * @param errorMessage - the error message itself
 * @param storyFilePath - The .story file path that failed
 * @param storyFileSource - The content (source code) for the .story file that failed
 * @param storyMetadata - The storyMetadata
 */
function createErrorLogFile({ errorMessage, storyFilePath, storyFileSource, storyMetadata }) {
  if (!initialized) {
    return;
  }

  const logSections = [];
  let storyFileName = 'log.error';
  let logFilePath = path.resolve(LOGS_PATH, storyFileName);
  let resolvedStorySourceCode = storyFileSource;

  if (storyFilePath) {
    storyFileName = storyFilePath ? `${path.basename(storyFilePath, path.extname(storyFilePath))}.error` : '';
    logFilePath = path.resolve(LOGS_PATH, storyFileName);
    resolvedStorySourceCode = !resolvedStorySourceCode ? readFile(storyFilePath) : '';
  }

  const componentPath = get(storyMetadata, 'dsmInfo.componentPath');
  const componentFilePath = componentPath && resolveFromComponentPath(storyFilePath, componentPath);
  const componentSourceCode = componentFilePath && readFile(componentFilePath);
  const { packageJson, dsmRcConfiguration } = options.logInformation;
  delete dsmRcConfiguration.authToken;

  packageJson && logSections.push({ title: `FILE: package.json`, data: packageJson });
  dsmRcConfiguration && logSections.push({ title: `FILE: '.dsmrc'`, data: dsmRcConfiguration });
  storyMetadata && logSections.push({ title: `Story metadata`, data: storyMetadata });
  resolvedStorySourceCode && logSections.push({ title: `Story source code`, data: resolvedStorySourceCode });
  componentSourceCode && logSections.push({ title: `Component source code`, data: componentSourceCode });

  const logEntry = `
---------------------------------------------------      DSM Log Start      ---------------------------------------------------
Error message: ${errorMessage}
  
Created Date: ${new Date().toLocaleString()}
Story file path: ${storyFilePath || 'No story file path'}
Component file path: ${componentFilePath || `Not found in "in-dsm"`}
${logSections.map(({ title, data }) => printLogSection(title, data)).join('')}
####  STORYBOOK CONFIG ${STORYBOOK_CONFIGURATION_PATH}
   
${CONFIG_DIRECTORY_FILES.map(({ title, data }) => printLogSection(title, data))} 
---------------------------------------------------      DSM Log End      -----------------------------------------------------
`;

  fs.ensureFileSync(logFilePath);
  return fs.appendFileSync(logFilePath, logEntry);
}

function printLogSection(title, data) {
  return `
###  ${title}
  
${typeof data === 'object' ? printJson(data) : data}
`;
}

function printJson(jsonObject) {
  return JSON.stringify(jsonObject, null, 2);
}

function clearOldLogFolder() {
  rimraf.sync(LOGS_PATH);
}

function readFile(filePath) {
  let file;
  try {
    file = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    file = `Failed to read file ${filePath}`;
  }

  return file;
}

module.exports = { initializeLogManager, createErrorLogFile };
