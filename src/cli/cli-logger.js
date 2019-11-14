const chalk = require('chalk');
const isString = require('lodash/isString');
const { createErrorLogFile } = require('./log-files/log-files-manager');

const getErrorMessage = (message) => (message && isString(message) ? message : message.stack);

const ora = require('ora');
const spinnerInstance = ora({ prefixText: chalk.cyan('DSM => ') });

module.exports = {
  info: (message) => spinnerInstance.stopAndPersist({ text: message }),
  warning: (message) => spinnerInstance.stopAndPersist({ text: chalk.yellow(message) }),
  success: (message) => spinnerInstance.succeed(message),
  progress: (message) => {
    spinnerInstance.start();
    spinnerInstance.text = message;
  },
  error: (message, exception, { storyFilePath, storySourceCode, storyMetadata } = {}) => {
    const errorMessage = `${getErrorMessage(message)} ${exception ? `\n${exception.stack}` : ''}`;
    createErrorLogFile({ errorMessage, storyFilePath, storySourceCode, storyMetadata });
    return spinnerInstance.fail(chalk.red(errorMessage));
  }
};
