/* eslint-disable react/prop-types,react/display-name */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@storybook/addon-options/register';
import React from 'react';
import addons from '@storybook/addons';
import injectCss from './inject-css';
import notifyDsm from '../services/notify-dsm';
import SampleCodePanel from './SampleCodePanel';
import { setConfiguration, getByEnvKey, environmentKeys, isInDsmContext } from '../services/configuration';
import { getByVersion, resolvers } from './versions';
import {
  DSM_ADDON_NAME,
  STORY_SELECTED_EVENT,
  HTML_SAMPLE_CODE_CHANGED_EVENT,
  KNOBS_SET_EVENT as DSM_KNOBS_SET_EVENT,
  INIT_DSM_REGISTERED_EVENT,
  INIT_DSM_EVENT,
  DSM_STORYBOOK_START_EVENT,
  STORY_CONTENT_LOADED,
  FRAMEWORKS
} from './constants';
import { optionsSettings, isLocalPreview } from './dsm-options';

export function registerDsm(envVariable) {
  addons.register(DSM_ADDON_NAME, (api) => {
    // Set environment variables on the window of the manager app
    setConfiguration(envVariable);

    const channel = addons.getChannel();

    // We need to pass the envVariable also to the window of storybook preview app, but since the InitDsm code runs after this code,
    // We first wait for an event that says the InitDsm code ran and is listening to the event that is emitted with the environment variable data.
    channel.on(`${INIT_DSM_REGISTERED_EVENT}`, () => {
      channel.emit(`${INIT_DSM_EVENT}`, envVariable, optionsSettings);
    });

    if (isInDsmContext()) {
      injectCss();

      const isUsingDeclarativeConfiguration = getByEnvKey(environmentKeys.isUsingDeclarativeConfiguration);

      if (isUsingDeclarativeConfiguration) {
        notifyDsm({
          eventName: DSM_STORYBOOK_START_EVENT
        });
      } else {
        channel.on(DSM_STORYBOOK_START_EVENT, () => {
          notifyDsm({
            eventName: DSM_STORYBOOK_START_EVENT
          });
        });
      }

      channel.on(STORY_SELECTED_EVENT, (data) => {
        notifyDsm(data);
      });

      channel.on(HTML_SAMPLE_CODE_CHANGED_EVENT, (data) => {
        if (getByEnvKey(environmentKeys.storybookFramework) === FRAMEWORKS.html) {
          notifyDsm(data);
        }
      });

      channel.on(STORY_CONTENT_LOADED, (data) => {
        notifyDsm(data);
      });

      const { KNOBS_SET_EVENT } = getByVersion(resolvers.knobsSetEvent);
      channel.on(KNOBS_SET_EVENT, (data) => {
        notifyDsm({
          eventName: DSM_KNOBS_SET_EVENT,
          ...data
        });
      });

      if (isLocalPreview()) {
        const framework = getByEnvKey(environmentKeys.storybookFramework);
        addons.addPanel(`${DSM_ADDON_NAME}/panel`, {
          title: 'Sample Code',
          render: ({ active }) => (
            <SampleCodePanel channel={addons.getChannel()} api={api} active={active} framework={framework} />
          )
        });
      }
    }
  });
}
