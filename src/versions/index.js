const { UnsupportedVersionError } = require('../services/version-resolvers-errors');
const { versionResolvers } = require('./version-resolvers');

const getByVersion = (resolver, storybookVersion) => {
  const result = versionResolvers[resolver](storybookVersion);
  if (!result) {
    throw new UnsupportedVersionError(storybookVersion);
  }

  return result;
};

const resolvers = {
  getStoryUrlParams: 'getStoryUrlParamsResolver',
  initDsmParams: 'initDsmParamsResolver'
};

export { getByVersion, resolvers };
