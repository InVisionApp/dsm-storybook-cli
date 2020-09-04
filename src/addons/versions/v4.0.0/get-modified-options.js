const getModifiedOptions = (panelsAvailable) => {
  return {
    fullscreen: {
      showAddonPanel: true,
      theme: { mainBorder: '' }
    },
    normal: {
      showAddonPanel: panelsAvailable
    }
  };
};

export { getModifiedOptions };
