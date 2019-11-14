const { getByVersion, resolvers } = require('../versions');

module.exports = function(kind, name, storybookVersion) {
  const { getStoryUrlParams } = getByVersion(resolvers.getStoryUrlParams, storybookVersion);
  return getStoryUrlParams(kind, name);
};
