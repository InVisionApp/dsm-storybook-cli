const getModifiedOptions = (panelsAvailable) => {
  return {
    fullscreen: {
      showAddonPanel: false,
      theme: { mainBorder: '' }
    },
    normal: {
      showAddonPanel: panelsAvailable
    }
  };
};

export { getModifiedOptions };
