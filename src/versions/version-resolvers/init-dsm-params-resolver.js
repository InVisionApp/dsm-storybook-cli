const semver = require('semver');
const v4_0_0 = require('../v4.0.0/init-dsm-params');
const v5_1_1 = require('../v5.1.1/init-dsm-params');

module.exports = function(storybookVersion) {
  if (!storybookVersion || semver.satisfies(storybookVersion, '^4.0.0')) {
    return v4_0_0;
  }

  if (semver.satisfies(storybookVersion, '^5.1.1')) {
    return v5_1_1;
  }
};
