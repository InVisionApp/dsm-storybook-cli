const onStoryChanged = (api, cb) => {
  return api.onStory((kind, name) => {
    return cb(kind, name);
  });
};

export { onStoryChanged };
