const validations = require('./validations');

function runValidations(configAst, configPath, storybookVersion) {
  validations.forEach((runValidations) => runValidations({ configAst, configPath, storybookVersion }));
}

module.exports = runValidations;
