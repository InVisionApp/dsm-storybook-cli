const { getByVersion, resolvers } = require('../versions');

module.exports = function(kind, name, storybookVersion, { defaultDocsTab = false }) {
  const { getStoryUrlParams } = getByVersion(resolvers.getStoryUrlParams, storybookVersion);
  return getStoryUrlParams(kind, name, defaultDocsTab);
};
