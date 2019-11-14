import addons, { makeDecorator } from '@storybook/addons';
import logger from './services/client-logger';
import userMessages from '../user-messages';

import { DSM_INFO_OBJECT_KEY, STORY_SELECTED_EVENT, HTML_SAMPLE_CODE_CHANGED_EVENT, FRAMEWORKS } from './constants';
import { environmentKeys, getByEnvKey } from '../services/configuration';
import { getStorySampleCode } from './html-sample-code';

function isDifferentStories(current, next) {
  return current.kind !== next.kind || current.story !== next.story;
}

let currentStory = null;

export default makeDecorator({
  name: 'withDsm',
  parameterName: DSM_INFO_OBJECT_KEY,
  skipIfNoParametersOrOptions: true,
  wrapper: (getStory, context) => {
    const story = getStory(context);
    const framework = getByEnvKey(environmentKeys.storybookFramework);

    // In HTML framework the sample code is the story itself on runtime, return the story only if it's a string and not a JS document
    if (framework === FRAMEWORKS.html) {
      const { containerClass } = context.parameters['in-dsm'];
      let sampleCode = '';

      try {
        sampleCode = getStorySampleCode(story, containerClass);
      } catch (e) {
        sampleCode = userMessages.failedToExtractSampleCode();
        logger.error(e);
      }

      addons.getChannel().emit(HTML_SAMPLE_CODE_CHANGED_EVENT, {
        eventName: HTML_SAMPLE_CODE_CHANGED_EVENT,
        sampleCode: sampleCode
      });
    }

    // Will emit the story selected event only one time per story selected instead of each time the story is updated
    // (for example story is updated each time knobs are changed)
    if (!currentStory || isDifferentStories(currentStory, context)) {
      // story.type won't exist for Vue, we ignore it for now (__docgenInfo is only relevant for react)
      const docgenInfo = story.type && story.type.__docgenInfo;

      const storyData = {
        eventName: STORY_SELECTED_EVENT,
        docgenInfo: docgenInfo
      };

      addons.getChannel().emit(STORY_SELECTED_EVENT, storyData);
      currentStory = context;
    }

    return story;
  }
});
