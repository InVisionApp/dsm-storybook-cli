const isEmpty = require('lodash/isEmpty');
const map = require('lodash/map');
const { readJsonFileFromPath } = require('../../utils/read-json-file');
const { FrameworkAnalyzerError } = require('../framework-analyzer-errors');
const userMessages = require('../../../user-messages');

function validateDsmInfo(dsmInfo) {
  const errors = [];

  if (isEmpty(dsmInfo.docFilePath)) {
    errors.push({ type: 'warning', message: userMessages.missingDocumentationFilePath() });
  }

  return errors;
}

function extractMetadata() {
  // we get the sample code for HTML on runtime from Storybook
  return null;
}

function extractDocgenInfo({ storyFilePath, dsmInfo }) {
  if (isEmpty(dsmInfo.docFilePath)) {
    return null;
  }

  const { file, filePath } = readJsonFileFromPath(storyFilePath, dsmInfo.docFilePath);
  if (isEmpty(file)) {
    throw new FrameworkAnalyzerError(true, userMessages.failedToLoadDocumentationFile(filePath));
  }

  return normalizeFileInfo(file);
}

function normalizeFileInfo(jsonFile) {
  return {
    description: jsonFile.description,
    displayName: jsonFile.displayName,
    props: map(jsonFile.props, ({ value, description, required }) => {
      // value is mandatory
      if (isEmpty(value)) {
        throw new FrameworkAnalyzerError(true, userMessages.missingMandatoryFieldInDocumentationFile('value'));
      }

      return {
        value,
        description,
        required: !!required
      };
    })
  };
}

module.exports = { extractMetadata, extractDocgenInfo, validateDsmInfo };
