import 'core-js/stable';
import 'regenerator-runtime/runtime';
import addons from '@storybook/addons';
import withDsm from './with-dsm';
import getDsmOptions from './dsm-options';
import { get } from 'lodash';
import { setConfiguration, isInDsmContext } from '../services/configuration';
import { INIT_DSM_EVENT, INIT_DSM_REGISTERED_EVENT, DSM_STORYBOOK_START_EVENT } from './constants';
import { getByVersion, resolvers } from './versions';

/**
 * @param params -
 * Changes according to Storybook version.
 * For v4   - { addDecorator, callback }
 * For v5.1 - { addDecorator, addParameters, callback}
 */
const initDsm = (params) => {
  const { addDecorator, callback } = params;
  const channel = addons.getChannel();

  // In case viewMode different than story we don't init DSM and we run the callback and finish
  if (!isInStoryViewMode()) {
    callback();
    return;
  }

  // Run the setup code only after we get the environment variable that contains all the configuration.
  // This event is emitted by the addon register code.
  channel.on(`${INIT_DSM_EVENT}`, (envVariable, optionsSettings) => {
    // Set environment variables on the window of the preview app
    setConfiguration(envVariable);

    // if not in DSM context run the callback and finish
    if (!isInDsmContext()) {
      callback();
      return;
    }

    const { applyOptions } = getByVersion(resolvers.applyOptions);

    return getDsmOptions(optionsSettings)
      .then((dsmOptions) => applyOptions(params, dsmOptions))
      .then(() => addDecorator(withDsm))
      .then(() => callback());
  });

  // Inform the register code that we are listening to the INIT_DSM_EVENT
  channel.emit(`${INIT_DSM_REGISTERED_EVENT}`);

  // Inform DSM that we have started configuring the addon. This triggers an error
  // timer in DSM where we wait for storybook content to load.
  channel.emit(`${DSM_STORYBOOK_START_EVENT}`);
};

/**
 * This method is being called before getting DSM configuration so we relay on the parent URL path name
 * If the pathname equals to '/iframe.html' it means we are *NOT* in Story view mode
 **/
const isInStoryViewMode = () => {
  try {
    const parentLocationPath = get(window, 'parent.location.pathname');
    return !/^\/iframe\.html/i.test(parentLocationPath);
  } catch (e) {
    // In case exception is thrown when trying to get parent location it means we are embedded in an iframe and blocked
    // from accessing it the parent OR in other case that is blocking us from it.
  }

  // If failed to get parent location we will try to validate the current window is under '.inVision' host
  const host = get(window, 'location.host');
  return /\.invision/i.test(host);
};

export { initDsm };
