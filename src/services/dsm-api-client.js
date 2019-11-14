const AxiosHttpClient = require('./axios-http-client');
const RequestHttpClient = require('./request-http-client');

const ApiClient = function(options, logger) {
  this.organization = options.organization;
  if (options.httpClient === 'rp') {
    this.httpClient = new RequestHttpClient(options, logger);
  } else {
    this.httpClient = new AxiosHttpClient(options, logger);
  }
};

ApiClient.prototype.signFiles = function(fileNames) {
  return this.httpClient.post(`${this.organization}/sign-files`, {
    fileNames: fileNames
  });
};

ApiClient.prototype.addMetadata = function(metadata) {
  return this.httpClient.post(`${this.organization}/metadata`, {
    metadata: metadata
  });
};

ApiClient.prototype.getStorybooks = function(limit) {
  return this.httpClient.post(`${this.organization}/storybooks`, {
    limit: limit
  });
};

ApiClient.prototype.deleteStorybook = function(buildId) {
  return this.httpClient.delete(`${this.organization}/${buildId}`);
};

ApiClient.prototype.verifyPackageVersion = function() {
  return this.httpClient.get('/verify-version');
};

ApiClient.prototype.verifyOrganizationSubscription = function() {
  return this.httpClient.post(`${this.organization}/verify-organization-subscription`);
};

ApiClient.prototype.uploadFile = function(url, data, headers) {
  return this.httpClient.uploadFile(url, data, headers);
};

module.exports = ApiClient;
