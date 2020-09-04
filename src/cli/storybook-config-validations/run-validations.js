const validations = require('./validations');

function runValidations(storybookOptions) {
  validations.forEach((runValidations) => runValidations(storybookOptions));
}

module.exports = runValidations;
