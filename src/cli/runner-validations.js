const get = require('lodash/get');
const logger = require('./cli-logger');
const userMessages = require('../user-messages');
const { validateStorybookConfigJs } = require('./storybook-config-validations');

/**
 * Performs validation against DSM api to make sure the local version of dsm-storybook is up to date and supported
 */
async function validateCliVersion(apiClient, options, allowFailure = false) {
  const localVersion = options.dsmStorybookVersion;
  if (!localVersion) {
    logger.error(userMessages.unknownStorybookVersion());
    process.exit(1);
  }

  logger.info(userMessages.verifyingCliVersion(localVersion));
  try {
    // get version info from server
    const response = await apiClient.verifyPackageVersion();
    const result = get(response, 'data.result');
    const { valid, minVersion } = result;
    if (!valid) {
      handleError(userMessages.cliUpgradeRequired(localVersion, minVersion), allowFailure);
    }
  } catch (err) {
    handleError(userMessages.cliVersionVerificationFailed(), allowFailure, err);
  }
}

/**
 * Performs validation against DSM api to make sure the organization has a subscription plan that enables live components integration
 */
async function validateOrganizationSubscription(apiClient, options, allowFailure = false) {
  logger.info(userMessages.verifyingOrganizationSubscription(options.organization));
  try {
    const res = await apiClient.verifyOrganizationSubscription();
    const allowed = get(res, 'data.result.allowed');

    if (!allowed) {
      handleError(userMessages.enterpriseGating(), allowFailure);
    }
  } catch (err) {
    handleError(userMessages.subscriptionVerificationFailed(options.organization), allowFailure, err);
  }
}

function handleError(msg, allowFailure, error) {
  if (!allowFailure) {
    logger.error(msg);
    if (error) {
      throw error;
    }
    process.exit(1);
  }

  logger.warning(msg);
}

async function performRunnerValidations(apiClient, options, allowFailure = false) {
  validateStorybookConfigJs({
    storybookVersion: options.storybookVersion,
    storybookConfigPath: options.storybookConfigPath,
    storybookConfigFolderPath: options.storybookConfigFolderPath,
    isUsingDeclarativeConfiguration: options.isUsingDeclarativeConfiguration
  });
  await validateCliVersion(apiClient, options, allowFailure);
  await validateOrganizationSubscription(apiClient, options, allowFailure);
}

module.exports = performRunnerValidations;
