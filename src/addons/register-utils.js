const Url = require('url-parse');
import { WINDOW_MODES, WINDOW_MODE_PARAM } from './constants';

export const getDisplayMode = () => {
  const url = new Url(window.location, true);
  const modeParam = url.query[WINDOW_MODE_PARAM];

  if (!modeParam) {
    return WINDOW_MODES.normal;
  }

  const mode = WINDOW_MODES[modeParam];
  if (!mode) {
    return WINDOW_MODES.normal;
  }

  return mode;
};
