const getModifiedOptions = (panelsAvailable) => {
  return {
    fullscreen: {
      showPanel: false
    },
    normal: {
      showPanel: panelsAvailable
    }
  };
};

export { getModifiedOptions };
