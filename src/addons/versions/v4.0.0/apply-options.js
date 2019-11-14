import { withOptions } from '@storybook/addon-options';

const applyOptions = ({ addDecorator }, dsmOptions) => {
  return dsmOptions && addDecorator(withOptions(dsmOptions));
};

export { applyOptions };
