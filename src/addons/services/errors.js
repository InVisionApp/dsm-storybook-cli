import { CustomError } from '../../services/custom-error';

class ArgumentError extends CustomError {
  constructor(arg, expectedType, receivedType, ...params) {
    super(...params);

    this.name = 'ArgumentError';
    this.message = `Expected to get "${expectedType}" but received "${receivedType}" for argument "${arg}".`;
  }
}

export { ArgumentError };
