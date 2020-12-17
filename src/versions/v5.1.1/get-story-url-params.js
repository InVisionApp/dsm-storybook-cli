const { sanitize } = require('./url-utils');

const getStoryUrlParams = (rawKind, rawName, defaultDocsTab) => {
  const { kind, name } = sanitizeParams(rawKind, rawName);
  const initialTab = defaultDocsTab ? 'docs' : 'story';

  return { path: `/${initialTab}/${kind}--${name}` };
};

const sanitizeParams = (rawKind, rawName) => {
  // the kind can contain hierarchy markers such as "/" and "|" that needs to be replaced with "-"
  let sanitizedKind = sanitize(rawKind);
  let sanitizedName = sanitize(rawName);

  return { kind: sanitizedKind, name: sanitizedName };
};

module.exports = { getStoryUrlParams, sanitizeParams };
