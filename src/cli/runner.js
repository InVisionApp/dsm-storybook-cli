const shortid = require('shortid');
const storyCollector = require('../metadata/story-collector');
const buildUtils = require('./build-utils');
const getAssetFiles = require('./asset-files-utils/get-asset-files');
const transformAssetUrls = require('./asset-files-utils/transform-assets-url');
const uploadAssets = require('./asset-files-utils/upload-assets');
const logger = require('./cli-logger');
const { initializeLogManager } = require('./log-files/log-files-manager');
const userMessages = require('../user-messages');
const ApiClient = require('../services/dsm-api-client');
const performRunnerValidations = require('./runner-validations');
const isEmpty = require('lodash/isEmpty');
const get = require('lodash/get');
const getPort = require('get-port');
const cliTable = require('cli-table3');
const moment = require('moment');

const getSampleCodeAnalyzer = require('../sample-code-generation/sample-code-analyzers').getSampleCodeAnalyzer;
const mapStoryFilesToStories = require('../metadata/map-story-files-to-stories');
const previewServer = require('./server/preview-data-server');
const { getByVersion, resolvers } = require('../versions');

// setting new characters to be used by shortId to avoid '-' char, which is not a valid character when passed as the first char of a CLI argument
const shortIdCharsList = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_.';
shortid.characters(shortIdCharsList);

/**
 * Process storybook and upload to DSM
 * */
async function publish(options, customArgs) {
  const apiClient = new ApiClient(options, logger);
  initializeLogManager(options, customArgs);
  await performRunnerValidations(apiClient, options);

  const storiesMetadata = storyCollector.collect(options);
  validateMetadata(storiesMetadata, true);

  // NOTE: This is only for traceability and to allow the user to see the data we upload
  buildUtils.writeStoryMetadata(storiesMetadata, options);

  if (!buildUtils.buildStorybook(options, customArgs)) {
    logger.error(userMessages.storybookBuildFailed());
    process.exit(1);
  }

  const buildId = shortid.generate();
  const assetFiles = getAssetFiles(options.outputDir);
  transformAssetUrls(assetFiles, { ...options, buildId });
  const uploaded = await uploadAssets(apiClient, assetFiles);

  logger.success(userMessages.assetUploadComplete());
  const storybookData = {
    assets: uploaded.map((item) => ({ fileName: item.fileName, assetKey: item.assetKey })),
    framework: options.storybookFramework,
    storybookVersion: options.storybookVersion,
    version: options.version,
    storybookDependencies: options.storybookDependencies,
    storiesMetadata: storiesMetadata,
    buildId: buildId,
    prettierConfiguration: options.prettierConfiguration
  };

  logger.progress(userMessages.updatingDsm());
  const res = await apiClient.addMetadata(storybookData);
  const missingExternalComponentIds = get(res, 'data.result.missingExternalComponentIds');
  if (!isEmpty(missingExternalComponentIds)) {
    logger.warning(userMessages.unmatchedComponentContainerIds());
    missingExternalComponentIds.forEach((missingId) => logger.warning(missingId));
  }
  logger.success(userMessages.dsmUpdateComplete(buildId));
}

/**
 * Process storybook and preview locally
 * */
async function preview(options, customArgs, previewOptions) {
  const apiClient = new ApiClient(options, logger);
  const previewServerPort = await getPort();
  let storybookPort = previewOptions.storybookPort;

  if (!storybookPort) {
    storybookPort = await getPort();
    customArgs = [customArgs, `-p ${storybookPort}`].join(' ');
  }

  initializeLogManager(options, customArgs);
  const warnOnly = true;
  await performRunnerValidations(apiClient, options, warnOnly);

  const storyFilesMetadata = storyCollector.collect(options);
  validateMetadata(storyFilesMetadata);

  const flatStoriesList = mapStoryFilesToStories(storyFilesMetadata);
  const storiesMetadata = generateSampleCode(flatStoriesList, options);
  const prettierConfig = options.prettierConfiguration;
  const serverData = { storiesMetadata, prettierConfig };

  previewServer.start(serverData, { port: previewServerPort, storybookPort, storybookSecure: previewOptions.storybookSecure });

  buildUtils.runStorybook(options, customArgs, previewServerPort);
}

/**
 * Show a list of recent storybooks
 */
async function listStorybooks(options, limit) {
  const apiClient = new ApiClient(options, logger);
  await performRunnerValidations(apiClient, options);

  logger.info('Retrieving your latest storybook uploads');
  const res = await apiClient.getStorybooks(limit);

  if (res.data && res.data.result && !isEmpty(res.data.result.storybooks)) {
    const storybooksTable = new cliTable({
      head: ['Build ID', 'Framework', 'Storybook Version', 'Creation Date']
    });

    res.data.result.storybooks.forEach(({ buildId, framework, version, createdDate }) => {
      const formattedDate = new moment(createdDate).format('YYYY-MM-DD HH:mm');
      storybooksTable.push([buildId, framework, version, formattedDate]);
    });

    console.log(storybooksTable.toString());
  } else {
    logger.error('No DSM storybooks found');
  }
}

async function deleteStorybook(options, buildId) {
  const apiClient = new ApiClient(options, logger);
  await performRunnerValidations(apiClient, options);

  logger.info(`Deleting storybook with buildId: ${buildId}`);
  try {
    await apiClient.deleteStorybook(buildId);
    logger.info('Deleted successfully.');
  } catch (e) {
    if ((e.response && e.response && e.response.status === 404) || e.statusCode === 404) {
      logger.error(`Storybook with buildId ${buildId} doesn't exist.`);
    } else {
      logger.error('Failed to delete storybook.');
    }
  }
}

function validateMetadata(storyFilesMetadata, forceExit) {
  if (isEmpty(storyFilesMetadata)) {
    logger.error(userMessages.noDsmStoriesFound());
    forceExit && process.exit(1);
  }
}

function generateSampleCode(storiesMetadata, { storybookFramework, storybookVersion }) {
  const { sanitizeParams } = getByVersion(resolvers.getStoryUrlParams, storybookVersion);
  const sampleCodeAnalyzer = getSampleCodeAnalyzer(storybookFramework);

  return storiesMetadata.map((storyMetadata) => {
    const sampleCodeMetadata = sampleCodeAnalyzer(storyMetadata, logger);
    const { kind: sanitizedKind, name: sanitizedName } = sanitizeParams(storyMetadata.kind, storyMetadata.name);

    return {
      kind: storyMetadata.kind,
      name: storyMetadata.name,
      sanitizedKind: sanitizedKind,
      sanitizedName: sanitizedName,
      sampleCodeMetadata: sampleCodeMetadata,
      docgenInfo: storyMetadata.dsmInfo.docgenInfo
    };
  });
}

function clearPreviousBuild(options) {
  buildUtils.clearOutputFolder(options);
}

module.exports = {
  publish,
  preview,
  clearPreviousBuild,
  listStorybooks,
  deleteStorybook
};
