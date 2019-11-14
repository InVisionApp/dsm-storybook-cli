const findFrameworkStrategyForType = (framework, type) => {
  const strategy = type[framework];
  if (!strategy) {
    throw `Unsupported framework detected: ${framework}`;
  }
  return strategy;
};

module.exports = { findFrameworkStrategyForType };
