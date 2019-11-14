const { CustomError } = require('./custom-error');

class ModuleNotFoundError extends CustomError {
  constructor(moduleName, ...params) {
    super(...params);

    this.name = 'ModuleNotFoundError';
    this.message = `Could not load '${moduleName}'. This module is required by dsm-storybook. 
    Please install a version of '${moduleName}' that is compatible with the installed version of Storybook`;
  }
}

class UnsupportedVersionError extends CustomError {
  constructor(storybookVersion, ...params) {
    super(...params);

    this.name = 'UnsupportedVersionError';
    this.message = `Unsupported @Storybook version (${storybookVersion}). 
    @invisionapp/dsm-storybook plugin does not support this version of Storybook.`;
  }
}

module.exports = { ModuleNotFoundError, UnsupportedVersionError };
