const { sanitize } = require('./url-utils');

const getStoryUrlParams = (rawKind, rawName) => {
  const { kind, name } = sanitizeParams(rawKind, rawName);

  return { path: `/story/${kind}--${name}` };
};

const sanitizeParams = (rawKind, rawName) => {
  // the kind can contain hierarchy markers such as "/" and "|" that needs to be replaced with "-"
  let sanitizedKind = sanitize(rawKind);
  let sanitizedName = sanitize(rawName);

  return { kind: sanitizedKind, name: sanitizedName };
};

module.exports = { getStoryUrlParams, sanitizeParams };
