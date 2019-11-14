const axios = require('axios/index');
const { getByEnvKey, environmentKeys } = require('../services/configuration');

function getStoriesMetadata() {
  const port = getByEnvKey(environmentKeys.previewServerPort);
  return axios.get(`http://localhost:${port}/sample-code-data`).then(function(response) {
    return response.data;
  });
}

module.exports = {
  getStoriesMetadata
};
