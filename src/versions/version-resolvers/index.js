const getStoryUrlParamsResolver = require('./get-story-url-params-resolver');
const initDsmParamsResolver = require('./init-dsm-params-resolver');

const versionResolvers = {
  getStoryUrlParamsResolver,
  initDsmParamsResolver
};

module.exports = { versionResolvers };
