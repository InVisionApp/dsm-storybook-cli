const logger = require('../../cli-logger');
const userMessages = require('../../../user-messages');
const { getByVersion, resolvers } = require('../../../versions');
const { getCallExpressionsToValidate } = require('../utils');

function initDsmValidations({ configAst, configPath, storybookVersion }) {
  const initDsmCallExpressions = getCallExpressionsToValidate(configAst, 'initDsm');
  if (initDsmCallExpressions.length > 1) {
    logger.error(userMessages.moreThanOneCallToInitDsm(configPath));
  }

  const initDsmExpression = initDsmCallExpressions[0];

  if (!initDsmExpression) {
    logger.warning(userMessages.noInitDsmCallFound(configPath));
    return;
  }

  if (initDsmExpression.arguments.length !== 1) {
    logger.warning(userMessages.initDsmWrongArgument());
    return;
  }

  const argumentNode = initDsmExpression.arguments[0];

  // if the user sends a variable to initDsm we trust him that he knows what he is doing
  if (argumentNode.type === 'Identifier') {
    return;
  }

  const propKeys = argumentNode.properties.map((prop) => prop.key.name);
  const requiredParams = getByVersion(resolvers.initDsmParams, storybookVersion);
  const missingParams = requiredParams.reduce((acc, param) => (!propKeys.includes(param) ? [...acc, param] : acc), []);

  if (missingParams.length !== 0) {
    throw new Error(userMessages.initDsmMissingParameters(missingParams));
  }
}

module.exports = initDsmValidations;
