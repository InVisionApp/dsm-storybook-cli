const { assert } = require('chai');
const resolveDsmInfo = require('../src/metadata/resolve-dsm-info');

describe('Resolve DSM info tests', function() {
  it('Should load version from versionFilePath', function() {
    const EXPECTED_VERSION = '1.1.1';
    const dummyDsmInfo = {
      version: '0.0.1',
      id: 'a',
      versionFilePath: './test/data/versionFile.json'
    };

    const resolved = resolveDsmInfo(dummyDsmInfo, '');

    assert.equal(resolved.version, EXPECTED_VERSION);
  });

  it('Should fallback to version if versionFilePath is wrong', function() {
    const dummyDsmInfo = {
      version: '0.0.1',
      id: 'a',
      versionFilePath: './wrong-path/versionFile.json'
    };

    const resolved = resolveDsmInfo(dummyDsmInfo, '');

    assert.equal(resolved.version, dummyDsmInfo.version);
  });
});
