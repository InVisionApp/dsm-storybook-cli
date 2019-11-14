const { CustomError } = require('../../services/custom-error');

class FrameworkAnalyzerError extends CustomError {
  constructor(isFatal, ...params) {
    super(...params);

    this.name = 'FrameworkAnalyzerError';
    this.isFatal = isFatal;
  }
}

module.exports = { FrameworkAnalyzerError };
