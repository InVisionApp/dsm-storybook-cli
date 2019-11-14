const rp = require('request-promise');

const { CLI_CLIENT_NAME } = require('../cli/constants');
const defaultHeaders = { 'Request-Source': CLI_CLIENT_NAME };

const TIMEOUT_MS = 360000; // 6 minutes

class RequestPromiseHttpClient {
  constructor(options, logger) {
    this.authToken = options.authToken;
    this.logger = logger;
    this.clientVersionInfo = { client: CLI_CLIENT_NAME, clientVersion: options.dsmStorybookVersion };
    rp.debug = !!options.debug;

    const port = options.port || 443;
    const requestOptions = {
      baseUrl: `https://${options.dsmHost}:${port}/dsm-api/storybook/`,
      timeout: TIMEOUT_MS
    };

    if (options.proxyUrl && options.proxyPort) {
      requestOptions.proxy = `${options.proxyUrl}:${options.proxyPort}`;

      // support the case where the user only has a HTTP proxy, in which case we need to tunnel
      // the https traffic over http
      if (options.tunnel !== undefined) {
        requestOptions.tunnel = options.tunnel;
      }
    }

    this.request = rp.defaults(requestOptions);
  }

  get(url, params = {}) {
    const options = { method: 'GET', json: true, url, qs: Object.assign({}, params, this.clientVersionInfo) };
    return this.request(options).then((response) => {
      return { data: { result: response.result } };
    });
  }

  post(url, data = {}, headers = {}) {
    const options = {
      method: 'POST',
      url: url,
      json: true,
      body: Object.assign({}, data, { authToken: this.authToken }),
      qs: this.clientVersionInfo,
      headers: Object.assign({}, defaultHeaders, headers)
    };
    return this.request(options).then((response) => {
      return { data: { result: response.result } };
    });
  }

  delete(url) {
    const options = {
      method: 'DELETE',
      url,
      json: true,
      body: { authToken: this.authToken },
      qs: this.clientVersionInfo,
      headers: defaultHeaders
    };
    return this.request(options);
  }

  uploadFile(url, data, headers = {}) {
    return this.request.defaults({ baseUrl: null })({
      method: 'POST',
      url,
      body: data,
      maxContentLength: 104857600,
      headers: Object.assign({}, defaultHeaders, headers)
    });
  }
}

module.exports = RequestPromiseHttpClient;
