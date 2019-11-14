const FRAMEWORK_ANALYZERS = {
  react: require('./react/framework-analyzer'),
  vue: require('./vue/framework-analyzer'),
  angular: require('./angular/framework-analyzer'),
  html: require('./html/framework-analyzer')
};

const getFrameworkAnalyzer = (framework) => {
  const analyzer = FRAMEWORK_ANALYZERS[framework];
  if (!analyzer) {
    throw `Unsupported framework detected: ${framework}`;
  }
  return analyzer;
};

module.exports = {
  getFrameworkAnalyzer
};
