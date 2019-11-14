const chai = require('chai');
const { assert } = chai;
const runValidations = require('../src/cli/storybook-config-validations/run-validations');
const sources = require('./data/storybook-config-validator-test-cases');
const parse = require('../src/metadata/parser');

describe('initDsm validations in config.js', function() {
  it('validate simple initDsm v4', function() {
    assert.doesNotThrow(() => runTest(sources.getSimpleInitDsmV4()));
  });

  it('validate simple initDsm v5', function() {
    assert.doesNotThrow(() => runTest(sources.getSimpleInitDsmV5()));
  });

  it('more than one call to initDsm', function() {
    assert.doesNotThrow(() => runTest(sources.getMoreThanOneCallToInitDsm()));
  });

  it('missing properties v4', function() {
    assert.throws(() => runTest(sources.getMissingPropertiesInitDsmV4()));
  });

  it('missing properties v5', function() {
    assert.throws(() => runTest(sources.getMissingPropertiesInitDsmV5()));
  });

  it('more than one params sent to initDsm', function() {
    assert.doesNotThrow(() => runTest(sources.getMoreThanOneParamInitDsm()));
  });

  it('no params sent to initDsm', function() {
    assert.doesNotThrow(() => runTest(sources.getNoParamsInitDsm()));
  });

  it('no initDsm', function() {
    assert.doesNotThrow(() => runTest(sources.getNoInitDsm()));
  });

  it('sending a variable to initDsm', function() {
    assert.doesNotThrow(() => runTest(sources.getVariableArgumentInitDsm()));
  });

  it('expression statement without callee', function() {
    assert.doesNotThrow(() => runTest(sources.getExpressionStatementWithoutCalleeInCodeInitDsm()));
  });
});

describe('configure validations in config.js', function() {
  it('one call to configure in initDsm', function() {
    assert.doesNotThrow(() => runTest(sources.getSimpleOneCallToConfigureInDsm()));
  });

  it('one call to configure without dsm', function() {
    assert.doesNotThrow(() => runTest(sources.getSimpleOneCallToConfigureWithoutDsm()));
  });

  it('more than one call to configure', function() {
    assert.doesNotThrow(() => runTest(sources.getMoreThanOneCallToConfigure()));
  });
});

function runTest({ version, sourceCode }) {
  const ast = parse(sourceCode);
  return runValidations(ast, `-c ./dummy-path.js`, version);
}
