const { findFrameworkStrategyForType } = require('./find-framework-strategy-for-type');

const SAMPLE_CODE_BUILDERS = {
  react: require('./react/build-sample-code'),
  vue: require('./vue/build-sample-code'),
  angular: require('./angular/build-sample-code'),
  html: require('./html/build-sample-code')
};

const getSampleCodeBuilder = (framework) => {
  return findFrameworkStrategyForType(framework, SAMPLE_CODE_BUILDERS);
};

module.exports = { getSampleCodeBuilder };
