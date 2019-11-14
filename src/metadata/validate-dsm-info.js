const userMessages = require('../user-messages');
const cliTable = require('cli-table3');
const chalk = require('chalk');

module.exports = function(dsmInfo, storyName, kind, frameworkDsmInfoValidation) {
  let isValid = true;
  let errorsList = [];
  const optionalKeys = ['version', 'versionFilePath', 'component'];

  if (!dsmInfo.id) {
    errorsList.push({ type: 'error', message: userMessages.missingRequiredKey('id') });
    isValid = false;
  }

  // Some keys are optional, but can't be empty. we should warn users if they accidentally pass them empty
  optionalKeys.forEach((key) => {
    if ((key in dsmInfo && !dsmInfo[key]) || (dsmInfo[key] && dsmInfo[key].trim() === '')) {
      errorsList.push({ type: 'warning', message: userMessages.passedEmptyKey(key) });
    }
  });

  // get framework specific validation errors
  errorsList = errorsList.concat(frameworkDsmInfoValidation(dsmInfo));

  if (errorsList.length) {
    const errorsTable = new cliTable({ wordWrap: true, colWidths: [100], style: { border: ['cyan'] } });

    errorsTable.push([{ content: userMessages.dsmInfoErrorsTableTitle(chalk.cyan(storyName), chalk.cyan(kind)) }]);

    errorsList.forEach((error) => {
      errorsTable.push([{ content: error.type === 'error' ? chalk.red(error.message) : chalk.yellow(error.message) }]);
    });

    console.log(errorsTable.toString());
  }

  return { isValid, errorsList };
};
