const { findFrameworkStrategyForType } = require('./find-framework-strategy-for-type');

const SAMPLE_CODE_ANALYZERS = {
  react: require('./react/sample-code-analyzer'),
  vue: require('./vue/sample-code-analyzer'),
  angular: require('./angular/sample-code-analyzer'),
  // In Html we don't analyze the sample code in DSM but get it as is from Storybook.
  // This is a stub is to support HTML framework.
  html: () => {}
};

const getSampleCodeAnalyzer = (framework) => {
  return findFrameworkStrategyForType(framework, SAMPLE_CODE_ANALYZERS);
};

module.exports = { getSampleCodeAnalyzer };
