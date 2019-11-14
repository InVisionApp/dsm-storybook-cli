import { WINDOW_MODES } from './constants';
import { fetchOptions } from './remote-resources';
import { getByVersion, resolvers } from './versions';

export default (optionsSettings) => {
  return fetchOptions().then((options) => {
    const modifiedOptions = getModifiedOptions(optionsSettings);

    return {
      ...options,
      ...modifiedOptions,
      theme: { ...options.theme, ...modifiedOptions.theme }
    };
  });
};

const getModifiedOptions = ({ displayMode, panelsAvailable }) => {
  const { getModifiedOptions } = getByVersion(resolvers.getModifiedOptions);
  const modifiedOptions = getModifiedOptions(panelsAvailable);
  return displayMode === WINDOW_MODES.fullscreen ? modifiedOptions.fullscreen : modifiedOptions.normal;
};
