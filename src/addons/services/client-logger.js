/* eslint-disable no-console */
import { isString } from 'lodash';

const getErrorMessage = (message) => (message && isString(message) ? message : message.stack);

export default {
  info: (message) => console.log(message),
  warning: (message) => console.log(message),
  error: (message, exception) => console.log(`${getErrorMessage(message)} ${exception ? `\n${exception.stack}` : ''}`)
};
