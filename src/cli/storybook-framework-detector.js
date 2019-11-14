const logger = require('./cli-logger');
const userMessages = require('../user-messages');
const { FRAMEWORKS } = require('./constants');

// The values in this map must be in sync with the enum values of the storybook-schema in api (storybook-ui-frameworks.js)
const FRAMEWORKS_MAP = {
  '@storybook/react': FRAMEWORKS.react,
  '@storybook/react-native': FRAMEWORKS.reactNative,
  '@storybook/vue': FRAMEWORKS.vue,
  '@storybook/angular': FRAMEWORKS.angular,
  '@storybook/mithril': FRAMEWORKS.mithril,
  '@storybook/marko': FRAMEWORKS.marko,
  '@storybook/html': FRAMEWORKS.html,
  '@storybook/svelte': FRAMEWORKS.svelte,
  '@storybook/ember': FRAMEWORKS.ember,
  '@storybook/riot': FRAMEWORKS.riot
};

function getStorybookFramework(storybookDependencies, configuration) {
  const explicitFramework = getExplicitFrameworkFromConfiguration(configuration);
  const frameworkDependencies = storybookDependencies.filter((dependency) => {
    return FRAMEWORKS_MAP[dependency.name];
  });

  if (frameworkDependencies.length === 0) {
    logger.error(userMessages.storybookNotDetected());
    process.exit(1);
  }

  if (frameworkDependencies.length > 1 && !explicitFramework) {
    logger.error(userMessages.moreThanOneStorybookFrameworkDetected());
    process.exit(1);
  }

  let framework = null;
  if (explicitFramework) {
    framework = frameworkDependencies.find((dependency) => {
      return FRAMEWORKS_MAP[dependency.name] === explicitFramework;
    });

    if (!framework) {
      logger.error(userMessages.explicitFrameworkNotDetectedInInstalledPackages(explicitFramework));
      process.exit(1);
    }
  } else {
    framework = frameworkDependencies[0];
  }

  return { name: FRAMEWORKS_MAP[framework.name], version: framework.version };
}

function getExplicitFrameworkFromConfiguration(configuration) {
  const { framework } = configuration;
  if (!framework) {
    return null;
  }

  const lowerCaseFramework = framework.toLowerCase();
  if (!Object.values(FRAMEWORKS).includes(lowerCaseFramework)) {
    logger.warning(userMessages.providedFrameworkIsIncorrect(lowerCaseFramework));
    return null;
  }

  logger.info(userMessages.usingFrameworkFromConfiguration(lowerCaseFramework));
  return lowerCaseFramework;
}

module.exports = getStorybookFramework;
