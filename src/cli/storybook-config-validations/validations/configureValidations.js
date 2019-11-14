const logger = require('../../cli-logger');
const userMessages = require('../../../user-messages');
const { getCallExpressionsToValidate } = require('../utils');

function configureValidations({ configAst, configPath }) {
  const configureCallExpressions = getCallExpressionsToValidate(configAst, 'configure');
  if (configureCallExpressions.length > 1) {
    logger.error(userMessages.moreThanOneCallToConfigure(configPath));
  }
}

module.exports = configureValidations;
