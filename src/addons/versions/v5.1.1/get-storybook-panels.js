import addons from '@storybook/addons';

const getStorybookPanels = () => {
  return addons.getElements('panel');
};

export { getStorybookPanels };
