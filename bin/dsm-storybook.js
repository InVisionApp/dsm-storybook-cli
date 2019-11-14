#!/usr/bin/env node

const program = require('commander');
const keys = require('lodash/keys');

const { runner, cliLogger, cliUtils, buildConfiguration } = require('../dist/dsm-storybook-node');

program
  .version('0.1.0')
  .option('--dsm-host [host]', 'The DSM server')
  .option('--auth-token [token]', 'Key provided to you by DSM to authenticate uploads')
  .option('--story-path [glob]', 'Path to folder containing storybook stories')
  .option('-o, --output-dir [path]', 'Path to folder to store the DSM build artifacts');

program
  .command('publish')
  .allowUnknownOption()
  .action(async function() {
    const { customArgs, configuration } = getConfigurations();
    runner.clearPreviousBuild(configuration);
    try {
      await runner.publish(configuration, customArgs);
    } catch (e) {
      cliLogger.error(e);
    }
  });

program
  .command('preview')
  .allowUnknownOption()
  .action(async function() {
    const { customArgs, configuration } = getConfigurations();
    try {
      const previewOptions = { storybookPort: program.port || program.p, storybookSecure: program.https };
      await runner.preview(configuration, customArgs, previewOptions);
    } catch (e) {
      cliLogger.error(e);
    }
  });

program.command('list [limit]').action(async function(limit = 10) {
  const { configuration } = getConfigurations();

  try {
    await runner.listStorybooks(configuration, parseInt(limit));
  } catch (e) {
    cliLogger.error(e);
  }
});

program.command('delete <buildId>').action(async function(buildId) {
  const { configuration } = getConfigurations();

  try {
    await runner.deleteStorybook(configuration, buildId);
  } catch (e) {
    cliLogger.error(e);
  }
});

program.parse(process.argv);

function getConfigurations() {
  const options = optionsFromArgs();

  const customArgs = cliUtils.getCustomArgs(program).join(' ');
  const configuration = buildConfiguration.create(options);

  return {
    customArgs,
    configuration
  };
}

/**
 * normalize cli args
 * */
function optionsFromArgs() {
  const configurationKeys = buildConfiguration.configurationKeys;
  return keys(configurationKeys).reduce((acc, key) => {
    if (program[key]) {
      acc[configurationKeys[key]] = program[key];
    }
    return acc;
  }, {});
}
