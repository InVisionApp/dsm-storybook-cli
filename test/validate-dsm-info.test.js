const { assert } = require('chai');
const validateDsmInfo = require('../src/metadata/validate-dsm-info');
const getFrameworkAnalyzer = require('../src/metadata/framework-analyzers').getFrameworkAnalyzer;
const userMessages = require('../src/user-messages');

describe('Validate DSM info tests', function() {
  it('Should validate existence of ID, and break without it', function() {
    const FRAMEWORK = 'react';
    const dummyDsmInfo = {
      version: '0.0.1'
    };

    const frameworkAnalyzer = getFrameworkAnalyzer(FRAMEWORK);
    const validationResult = validateDsmInfo(dummyDsmInfo, 'story name', 'kind', frameworkAnalyzer.validateDsmInfo);

    assert.equal(validationResult.isValid, false);
    assert.equal(validationResult.errorsList[0].message, userMessages.missingRequiredKey('id'));
  });

  it('Should validate existence of ID, and continue execution when present', function() {
    const FRAMEWORK = 'react';
    const dummyDsmInfo = {
      version: '0.0.1',
      id: 'a'
    };

    const frameworkAnalyzer = getFrameworkAnalyzer(FRAMEWORK);
    const validationResult = validateDsmInfo(dummyDsmInfo, 'story name', 'kind', frameworkAnalyzer.validateDsmInfo);

    assert.equal(validationResult.isValid, true);
  });

  it('Should warn if optional keys have empty values', function() {
    const FRAMEWORK = 'react';
    const dummyDsmInfo = {
      version: '',
      versionFilePath: '     ',
      id: 'a'
    };

    const frameworkAnalyzer = getFrameworkAnalyzer(FRAMEWORK);
    const validationResult = validateDsmInfo(dummyDsmInfo, 'story name', 'kind', frameworkAnalyzer.validateDsmInfo);

    assert.equal(validationResult.isValid, true);
    assert.equal(validationResult.errorsList[0].message, userMessages.passedEmptyKey('version'));
    assert.equal(validationResult.errorsList[1].message, userMessages.passedEmptyKey('versionFilePath'));
  });

  it('Should warn if missing `componentPath` for angular framework', function() {
    const FRAMEWORK = 'angular';
    const dummyDsmInfo = {
      id: 'a'
    };

    const frameworkAnalyzer = getFrameworkAnalyzer(FRAMEWORK);
    const validationResult = validateDsmInfo(dummyDsmInfo, 'story name', 'kind', frameworkAnalyzer.validateDsmInfo);

    assert.equal(validationResult.isValid, true);
    assert.equal(validationResult.errorsList[0].message, userMessages.missingComponentPath());
  });

  it('Should warn if missing `componentPath` for angular framework', function() {
    const FRAMEWORK = 'angular';
    const dummyDsmInfo = {
      id: 'a'
    };

    const frameworkAnalyzer = getFrameworkAnalyzer(FRAMEWORK);
    const validationResult = validateDsmInfo(dummyDsmInfo, 'story name', 'kind', frameworkAnalyzer.validateDsmInfo);

    assert.equal(validationResult.isValid, true);
    assert.equal(validationResult.errorsList[0].message, userMessages.missingComponentPath());
  });

  it('Should warn if missing `componentPath` for vue framework', function() {
    const FRAMEWORK = 'vue';
    const dummyDsmInfo = {
      id: 'a'
    };

    const frameworkAnalyzer = getFrameworkAnalyzer(FRAMEWORK);
    const validationResult = validateDsmInfo(dummyDsmInfo, 'story name', 'kind', frameworkAnalyzer.validateDsmInfo);

    assert.equal(validationResult.isValid, true);
    assert.equal(validationResult.errorsList[0].message, userMessages.missingComponentPath());
  });

  it('Should warn if missing `docFilePath` for html validation', function() {
    const FRAMEWORK = 'html';
    const dummyDsmInfo = {
      id: 'a'
    };

    const frameworkAnalyzer = getFrameworkAnalyzer(FRAMEWORK);
    const validationResult = validateDsmInfo(dummyDsmInfo, 'story name', 'kind', frameworkAnalyzer.validateDsmInfo);

    assert.equal(validationResult.isValid, true);
    assert.equal(validationResult.errorsList[0].message, userMessages.missingDocumentationFilePath());
  });
});
