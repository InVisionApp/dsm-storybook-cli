const isEmpty = require('lodash/isEmpty');

const environmentKeys = {
  dsmHost: 'DSM_HOST',
  dsmProdEnvironment: 'DSM_PROD_ENV',
  authToken: 'DSM_AUTH_TOKEN',
  previewServerPort: 'DSM_PREVIEW_SERVER_PORT',
  storybookFramework: 'STORYBOOK_FRAMEWORK',
  storybookVersion: 'STORYBOOK_VERSION'
};

let runConfiguration = null;

function setConfiguration(dsmEnvVariable) {
  try {
    runConfiguration = dsmEnvVariable ? JSON.parse(dsmEnvVariable) : {};
  } catch (e) {
    // Not sure why, but "dsmEnvVariable" is coming in as the string "_undefined_"
  }
}

function getByEnvKey(key) {
  if (!validateInitialization()) {
    return null;
  }

  return runConfiguration[key];
}

/**
 * if dsmEnvVariable was empty during initialization then we are not running in the context of the DSM cli
 */
function isInDsmContext() {
  if (!validateInitialization()) {
    return false;
  }
  return !isEmpty(runConfiguration);
}

function validateInitialization() {
  if (runConfiguration === null) {
    return false;
  }
  return true;
}

module.exports = { setConfiguration, environmentKeys, getByEnvKey, isInDsmContext };
