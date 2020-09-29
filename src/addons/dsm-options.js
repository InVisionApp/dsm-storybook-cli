import { WINDOW_MODES } from './constants';
import { fetchOptions } from './remote-resources';
import { getByVersion, resolvers } from './versions';
import { getDisplayMode } from './register-utils';
import { setConfiguration, getByEnvKey, environmentKeys, isInDsmContext } from '../services/configuration';
import { ModuleNotFoundError } from '../services/version-resolvers-errors';

export default function getOptions(optionsSettings) {
  return fetchOptions().then((options) => {
    const modifiedOptions = getModifiedOptions(optionsSettings);

    return {
      ...options,
      ...modifiedOptions,
      theme: { ...options.theme, ...modifiedOptions.theme }
    };
  });
}

export const optionsSettings = {
  displayMode: getDisplayMode(),
  panelsAvailable: (isInDsmContext() && arePanelsAvailable()) || isLocalPreview()
};

export const getDsmOptions = (envVariable) => {
  setConfiguration(envVariable);

  // A user is running `storybook` instead of `dsm-storybook`. Running `storybook` will not
  // populate the environment variable.
  if (!isInDsmContext()) {
    return {};
  }

  const { defaultOptions } = getByVersion(resolvers.getConfigurationFallback);
  const options = defaultOptions(getByEnvKey(environmentKeys.dsmProdEnvironment));
  const modifiedOptions = getModifiedOptions(optionsSettings);

  return {
    ...options,
    ...modifiedOptions
  };
};

export const getDsmTheme = (envVariable) => {
  setConfiguration(envVariable);

  // A user is running `storybook` instead of `dsm-storybook`. Running `storybook` will not
  // populate the environment variable. Storybook will break if it tries to apply an "empty"
  // theme, so we return the Storybook default theme.
  if (!isInDsmContext()) {
    const requireTheming = () => {
      try {
        return require('@storybook/theming');
      } catch (e) {
        throw new ModuleNotFoundError('@storybook/theming');
      }
    };

    const { themes } = requireTheming();
    return themes.light;
  }

  const { defaultTheme } = getByVersion(resolvers.getConfigurationFallback);
  return defaultTheme;
};

const getModifiedOptions = ({ displayMode, panelsAvailable }) => {
  const { getModifiedOptions } = getByVersion(resolvers.getModifiedOptions);
  const modifiedOptions = getModifiedOptions(panelsAvailable);
  return displayMode === WINDOW_MODES.fullscreen ? modifiedOptions.fullscreen : modifiedOptions.normal;
};

function arePanelsAvailable() {
  const { getStorybookPanels } = getByVersion(resolvers.getStorybookPanels);
  const panels = getStorybookPanels();
  return Object.keys(panels).length > 0;
}

export function isLocalPreview() {
  return !getByEnvKey(environmentKeys.dsmProdEnvironment);
}
