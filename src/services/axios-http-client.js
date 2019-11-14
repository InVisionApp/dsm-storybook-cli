const axios = require('axios');

const { CLI_CLIENT_NAME } = require('../cli/constants');
const defaultHeaders = { 'Request-Source': CLI_CLIENT_NAME };

class AxiosHttpClient {
  constructor(options, logger) {
    this.authToken = options.authToken;
    const clientVersion = options.dsmStorybookVersion;
    this.clientVersionInfo = { client: CLI_CLIENT_NAME, clientVersion };
    const port = options.port || 443;

    const axiosOptions = {
      baseURL: `https://${options.dsmHost}:${port}/dsm-api/storybook`
    };

    // A user can be behind a corporate proxy server. If that's the case, we'll need to enable the user to instruct us
    // (Axios) how to connect to the proxy server. Any network traffic not directed at the proxy server is automatically
    // rejected by the networking infrastructure.
    if (options.proxyUrl && options.proxyPort) {
      const proxy = { host: options.proxyUrl, port: options.proxyPort };

      // support the case where the user only has a HTTP proxy, in which case we need to tunnel
      // the https traffic over http
      if (options.tunnel) {
        const tunnel = require('tunnel');
        axiosOptions.httpsAgent = tunnel.httpsOverHttp({
          proxy: proxy
        });
        // by default axios attempts to resolve proxy settings by reading env variables.
        // turn this off and only use explicit settings
        axiosOptions.proxy = false;
      } else {
        axiosOptions.proxy = proxy;
      }
    }
    // use an instance of axios and not the default singleton since there could be multiple instances of this class
    this.axiosClient = axios.create(axiosOptions);

    this.logger = logger;
    if (options.debug) {
      this._configureDebugInterceptors();
    }
  }

  get(url, params = {}) {
    return this.axiosClient.get(url, { params: Object.assign({}, params, this.clientVersionInfo) });
  }

  post(url, data = {}, headers = {}) {
    const body = Object.assign({}, data, { authToken: this.authToken });
    const config = {
      params: this.clientVersionInfo,
      headers: Object.assign({}, defaultHeaders, headers)
    };
    return this.axiosClient.post(url, body, config);
  }

  delete(url) {
    return this.axiosClient.delete(url, {
      data: { authToken: this.authToken, params: this.clientVersionInfo },
      headers: defaultHeaders
    });
  }

  uploadFile(url, data, headers = {}) {
    return this.axiosClient({
      method: 'post',
      url,
      data,
      maxContentLength: 104857600,
      headers: Object.assign({}, defaultHeaders, headers)
    });
  }

  _configureDebugInterceptors() {
    if (!this.logger) {
      return;
    }

    // remove cyclic references that crashes JSON.stringify - Note that this causes data-loss
    const cyclicReplacer = () => {
      const seen = new WeakSet();

      return (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        return value;
      };
    };

    this.axiosClient.interceptors.request.use(
      (config) => {
        this.logger.info(`AXIOS_REQUEST_INTERCEPT: ${JSON.stringify(config, cyclicReplacer())}`);
        return config;
      },
      (error) => {
        this.logger.error('AXIOS_REQUEST_ERROR', error);
        return Promise.reject(error);
      }
    );
    this.axiosClient.interceptors.response.use(
      (response) => {
        this.logger.info(`AXIOS_RESPONSE_INTERCEPT: ${JSON.stringify(response.headers, cyclicReplacer())}`);
        return response;
      },
      (error) => {
        this.logger.error('AXIOS_RESPONSE_ERROR', error);
        return Promise.reject(error);
      }
    );
  }
}

module.exports = AxiosHttpClient;
