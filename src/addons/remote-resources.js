import axios from 'axios';
import { getByEnvKey, environmentKeys } from '../services/configuration';
import { getByVersion, resolvers } from './versions';

const getParams = () => {
  const host = getByEnvKey(environmentKeys.dsmHost);
  const params = {
    storybookVersion: getByEnvKey(environmentKeys.storybookVersion),
    isProduction: getByEnvKey(environmentKeys.dsmProdEnvironment)
  };

  return { host, params };
};

const fetchOptions = () => {
  const { host, params } = getParams();

  return get('dsm-options', host, params)
    .then((result) => result.options)
    .catch((error) => {
      console.log(`failed to load options json - fallback to default options. error: `, error);
      const { defaultOptions } = getByVersion(resolvers.getConfigurationFallback);
      return defaultOptions(params.isProduction);
    });
};

const fetchCss = () => {
  const { host, params } = getParams();

  return get('dsm-css', host, params)
    .then((result) => result.css)
    .catch((error) => {
      console.log(`failed to load CSS file - fallback to default CSS. error: `, error);
      const { defaultCss } = getByVersion(resolvers.getConfigurationFallback);
      return defaultCss(params.isProduction);
    });
};

const get = (endpoint, host, params) => {
  // setting xsrfCookieName to null removes axios need to access cookies
  // and by that removes the access denied error thrown while trying to get cookie from the same origin in v7
  return axios
    .get(`https://${host}/dsm-api/storybook/${endpoint}`, { params, xsrfCookieName: null })
    .then((response) => response.data.result);
};

export { fetchOptions, fetchCss };
