const DEFAULT_LANGUAGE = 'markup';
const LANGUAGE_FOR_FRAMEWORK = {
  html: 'markup',
  vue: 'markup',
  react: 'jsx'
};

const getLanguageByFramework = (framework) => {
  return LANGUAGE_FOR_FRAMEWORK[framework] || DEFAULT_LANGUAGE;
};

module.exports = {
  getLanguageByFramework
};
