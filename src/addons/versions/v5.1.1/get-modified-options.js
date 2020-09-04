const getModifiedOptions = (panelsAvailable) => {
  return {
    fullscreen: {
      showPanel: true
    },
    normal: {
      showPanel: panelsAvailable
    }
  };
};

export { getModifiedOptions };
