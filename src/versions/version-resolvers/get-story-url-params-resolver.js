const semver = require('semver');
const v4_0_0 = require('../v4.0.0/get-story-url-params');
const v5_1_1 = require('../v5.1.1/get-story-url-params');

// This resolver is an "endpoint" for all uploaded stories so this version resolving should support ALL uploaded stories versions
// even if we don't support them anymore they should still render correctly
module.exports = function(storybookVersion) {
  if (!storybookVersion || semver.satisfies(storybookVersion, '^4.0.0')) {
    return v4_0_0;
  }

  // to support pre-released versions of Storybook from v5.1.0-alpha.23 and above
  if (semver.satisfies(storybookVersion, '^5.1.0-alpha.23')) {
    return v5_1_1;
  }
};
