const getStoryUrlParams = (kind, name) => {
  return { selectedKind: kind, selectedStory: name };
};

const sanitizeParams = (kind, name) => {
  return { kind, name };
};

module.exports = { getStoryUrlParams, sanitizeParams };
