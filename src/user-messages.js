const ACTION_MESSAGES = {
  CONTACT_SUPPORT: 'Please contact support@invisionapp.com.',
  TROUBLESHOOT_URL: 'https://support.invisionapp.com',
  DSM_PLANS_URL: 'https://support.invisionapp.com/hc/en-us/articles/115005674286'
};

const messages = {
  configurationAlreadyLoaded: () =>
    `Attempting to initialize an already loaded build configuration. ${ACTION_MESSAGES.CONTACT_SUPPORT}`,
  configNotReady: () => `Attempt to read uninitialized configuration. ${ACTION_MESSAGES.CONTACT_SUPPORT}`,
  configLoadFailed: () => `Failed to load configuration. ${ACTION_MESSAGES.CONTACT_SUPPORT}`,
  missingConfigurationKey: (key) =>
    `Missing configuration key: ${key}. Please ensure to include a configuration key in the .dsmrc file, or pass the key as a command line argument.`,
  configurationFileNotFound: (fileName) =>
    `Could not find required configuration, please create a "${fileName}" file or provide commandline arguments.`,
  analysisWritten: (fileName) => `Analysis result written to file ${fileName}.`,
  creatingStorybookBundle: () => 'Creating Storybook bundle...',
  projectRootNotFound: () =>
    `Could not determine project root directory, package.json not found. Please ensure to run the command from the project root.`,
  verifyingCliVersion: (localVersion) => `Verifying dsm-storybook version (${localVersion}) is valid...`,
  unknownStorybookVersion: () =>
    `Could not detect dsm-storybook version. Please verify your setup. For further assistance visit (${
      ACTION_MESSAGES.TROUBLESHOOT_URL
    }).`,
  verifyingOrganizationSubscription: (organization) => `Verifying ${organization} subscription...`,
  storybookBuildFailed: () => `Failed to build Storybook. For further assistance visit (${ACTION_MESSAGES.TROUBLESHOOT_URL}).`,
  assetUploadComplete: () => 'Asset upload complete.',
  updatingDsm: () => 'updating DSM...',
  unmatchedComponentContainerIds: () =>
    'The following component container IDs are used in stories, but no matching IDs were found in DSM. DSM will not display stories with these IDs.',
  noDsmStoriesFound: () =>
    `No stories with DSM component container IDs were found. For further assistance visit (${ACTION_MESSAGES.TROUBLESHOOT_URL}).`,
  storybookNotDetected: () =>
    `Failed to detect Storybook framework. Please ensure you installed Storybook for your selected UI library correctly. See https://storybook.js.org/basics/slow-start-guide/ for details.`,
  storyboookMissingInPackageJson: () => 'Failed to get @storybook NPM packages. Please ensure Storybook is properly installed.',
  storybookMissingInNodeModules: () => 'Failed to find installed "node_modules" Storybook packages. Try running "npm install".',
  packageMissingInNodeModules: (packageName) =>
    `Package ${packageName} was not found in node_modules directory. Try running "npm install".`,
  uploadingFile: (filePath) => `Uploading file: ${filePath}...`,
  uploadComplete: (fileName) => `Upload complete: ${fileName}`,
  uploadError: (fileName) => `Upload failed: ${fileName}`,
  previewServerStarted: (port) => `DSM storybook preview-data server is listening on port: ${port}`,
  enterpriseGating: () =>
    `Publishing stories to DSM is only available on the DSM Enterprise plan. Visit ${
      ACTION_MESSAGES.DSM_PLANS_URL
    } to learn more.`,
  subscriptionVerificationFailed: (organization) =>
    `Could not verify ${organization} subscription plan. Please check your connection.`,
  cliVersionVerificationFailed: () => 'Could not verify @invisionapp/dsm-storybook version. Please check your connection',
  cliUpgradeRequired: (localVersion, minVersion) =>
    `Please upgrade @invisionapp/dsm-storybook. Your version (${localVersion}) is out of date (minimum supported version: ${minVersion})`,

  /* Needs review */
  oneReturnStatementPerStory: () => 'A story must have 1 explicit return statement',
  storyMustReturnObject: () => 'A story must return an object',
  templateMustBeString: () => 'Template property must be a string',
  noSampleCodeIfNoTemplate: () => 'No sample code will be displayed for a story with no template prop',
  invalidStory: () => 'Invalid story',
  missingComponentPath: () => "componentPath is not provided in in-dsm, can't generate props table info",
  invalidComponentProp: () => 'Invalid component property for story',
  sampleCodeNotAvailable: () => 'Sample code is not available (please check output log for warnings/errors)',
  passedEmptyKey: (key) => `You passed an empty key '${key}'`,
  dsmInfoErrorsTableTitle: (storyName, kind) =>
    `The following problems were detected in 'dsm-info' configuration object in story '${storyName}' of '${kind}':`,
  missingRequiredKey: (key) => `Missing required key '${key}'`,
  missingKeyInVersionFromFile: (filePath) => `Failed to find a version key in 'versionFilePath': ${filePath}`,
  failedWithFallbackVersionFromFile: (filePath) => `Failed to load 'versionFilePath': ${filePath}, falling back to 'version'.`,
  failedVersionFromFile: (filePath) => `Failed to load 'versionFilePath': ${filePath}`,
  dsmUpdateComplete: (buildId) => `DSM update complete. buildId: ${buildId}`,
  prettierConfigFound: () => `Custom prettier configuration was found for this project`,
  prettierConfigNotFound: () => `Custom prettier configuration was not found for this project`,
  analyzingFile: (path) => `Analyzing file ${path}`,
  noStoryFilesMatchingSearchPattern: (pathGlob) => `No story files matching search pattern: ${pathGlob}`,
  failedToAnalyzeFile: (path) => `Failed to analyze story source file "${path}"`,
  failedToReadStorySourceFile: (path) => `Failed to read story source file "${path}"`,
  failedToParseStorySourceFile: (path) => `Failed to parse story source file "${path}"`,
  missingDocumentationFilePath: () => `"docFilePath" is not provided in "in-dsm", can't generate prop table information`,
  failedToLoadDocumentationFile: (path) => `Failed to load documentation file "${path}"`,
  missingMandatoryFieldInDocumentationFile: (field) =>
    `Missing mandatory field "${field}" in documentation file for one of the items`,
  containerClassNotFound: (containerClass) =>
    `No containers with the class "${containerClass} found. Make sure to add the class to the container.`,
  multipleContainerClassesFound: (containerClass) =>
    `More than 1 containers with the class "${containerClass}" detected. Make sure the classname is unique.`,
  failedToExtractSampleCode: () => `Failed to extract sample code. ${ACTION_MESSAGES.CONTACT_SUPPORT}`,
  failedToParseInDsmInformation: (key, propType) =>
    `Parsing of "${key}" (type: "${propType}") failed while trying to extract in-dsm options. ${ACTION_MESSAGES.CONTACT_SUPPORT}`,
  moreThanOneCallToInitDsm: (configPath) =>
    `More than 1 call to "initDsm" found in ${configPath}.
    There should only be 1 call to "initDsm".
    For further assistance visit ${ACTION_MESSAGES.TROUBLESHOOT_URL}`,
  noInitDsmCallFound: (configPath) => `Didn't find any call to initialize DSM Storybook in ${configPath}`,
  initDsmWrongArgument: () => `"initDsm" takes only one object argument.`,
  initDsmMissingParameters: (missingParams) => `Please initialize DSM Storybook according to the instructions at help page.
     Missing parameters: ${missingParams.join(', ')}`,
  moreThanOneCallToConfigure: (configPath) => `More than 1 call to "configure" found in ${configPath}.
    There should be only 1 call to configure inside "initDsm" "callback" parameter.
    For further assistance visit ${ACTION_MESSAGES.TROUBLESHOOT_URL}`,
  failedToReadStorybookConfigFile: (path) => `Failed to read Storybook config file "${path}"`,
  failedToParseStorybookConfigFile: () => `Failed to parse Storybook config file.`,
  providedFrameworkIsIncorrect: (framework) =>
    `The framework '${framework}' provided from '.dsmrc' file is incorrect. Make sure you written it correctly inside the '.dsmrc' file. For further assistance visit ${
      ACTION_MESSAGES.TROUBLESHOOT_URL
    }`,
  usingFrameworkFromConfiguration: (framework) => `Using framework '${framework}' from '.dsmrc' configuration file`,
  moreThanOneStorybookFrameworkDetected: () =>
    `More than 1 Storybook UI framework dependencies detected. You can set the UI framework you want to use explicitly inside the '.dsmrc' file or make sure only 1 '@storybook/<framework>' is inside the 'package.json' file.`,
  explicitFrameworkNotDetectedInInstalledPackages: (framework) =>
    `Failed to detect the framework '${framework}' that was provided in '.dsmrc' file. Please ensure you installed Storybook for your selected UI library correctly. See https://storybook.js.org/basics/slow-start-guide/ for details.`,
  inDsmInitLocationError: (inDsmLevel) => `${inDsmLevel} 'in-dsm' must be initialized inside the 'parameters' property`
};

module.exports = messages;
