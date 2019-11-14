/* eslint-disable no-console */
import { isString } from 'lodash';

const getErrorMessage = (message) => (message && isString(message) ? message : message.stack);

export default {
  warning: (message) => console.log(message),
  error: (message, exception) => console.log(`${getErrorMessage(message)} ${exception ? `\n${exception.stack}` : ''}`)
};
