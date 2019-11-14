const fs = require('fs');
const mimeTypes = require('mime-types');
const keyBy = require('lodash/keyBy');
const get = require('lodash/get');
const logger = require('../cli-logger');
const userMessages = require('../../user-messages');

// required to allow self-signed SSL certs
if (process.env.NODE_ENV !== 'production') {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
}

async function uploadAssets(apiClient, assetFiles) {
  const signedAssetFiles = await signFiles(apiClient, assetFiles);
  await uploadFiles(apiClient, signedAssetFiles);
  return signedAssetFiles;
}

async function signFiles(apiClient, files) {
  try {
    const signed = await apiClient.signFiles(files.map((f) => f.fileName));
    const signedFilesByFileNameLookup = keyBy(signed.data.result, (item) => item.fileName);

    return files.map((file) => {
      return { ...file, ...signedFilesByFileNameLookup[file.fileName] };
    });
  } catch (e) {
    const status = get(e, 'response.status');
    if (status && status !== 404) {
      throw e;
    }

    throw new Error(`Failed to connect to DSM server. Check the correctness of your '.dsmrc' file. \n${e.stack}`);
  }
}

async function uploadFiles(apiClient, signedFiles) {
  // TODO - use Promise.map(..)
  for (let i = 0; i < signedFiles.length; i++) {
    let fileData = signedFiles[i];
    logger.progress(userMessages.uploadingFile(fileData.resolvedPath));

    const headers = {
      'Content-Type': mimeTypes.lookup(fileData.fileName)
    };

    try {
      const fileStream = fs.createReadStream(fileData.resolvedPath);
      await apiClient.uploadFile(fileData.signedUrl, fileStream, headers);
      logger.success(userMessages.uploadComplete(fileData.fileName));
    } catch (e) {
      logger.error(userMessages.uploadError(fileData.fileName));
      throw e;
    }
  }
}

module.exports = uploadAssets;
