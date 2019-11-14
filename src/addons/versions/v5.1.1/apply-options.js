import { ModuleNotFoundError } from '../../../services/version-resolvers-errors';

const requireTheming = () => {
  try {
    return require('@storybook/theming');
  } catch (e) {
    throw new ModuleNotFoundError('@storybook/theming');
  }
};

const applyOptions = ({ addParameters }, dsmOptions) => {
  if (!dsmOptions) {
    return;
  }

  const { create } = requireTheming();
  const options = { options: { ...dsmOptions, theme: create({ base: 'light', ...dsmOptions.theme }) } };
  return addParameters(options);
};

export { applyOptions };
