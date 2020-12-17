import addons, { makeDecorator } from '@storybook/addons';
import logger from './services/client-logger';
import userMessages from '../user-messages';

import { STORY_SELECTED_EVENT, HTML_SAMPLE_CODE_CHANGED_EVENT, DSM_INFO_OBJECT_KEY, STORY_CONTENT_LOADED } from './constants';
import { getStorySampleCode } from './html-sample-code';

function isDifferentStories(current, next) {
  return current.kind !== next.kind || current.story !== next.story;
}

let currentStory = null;

const emitHtmlSampleCode = (story, context) => {
  // In HTML framework the sample code is the story itself on runtime, the story only
  // if it's a string and not a JS document
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
};

const emitStoryData = (story, context) => {
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
};

const emitStoryLayoutDimensions = () => {
  const CONTENT_REFRESH_TIME = 200; // ms
  const RETRY_MAX_ATTEMPTS = 20;
  let retryCount = 0;

  const messageContentHeightInterval = setInterval(() => {
    const container = document.getElementById('docs-root');

    // If the container does not exist we want to continue retrying in the "else" block.
    // Additionally if the container DOES exist but is hidden, the offsetHeight will be 0.
    // In this case we also continue retrying.
    if (container && container.offsetHeight) {
      addons.getChannel().emit(STORY_CONTENT_LOADED, {
        eventName: STORY_CONTENT_LOADED,
        height: container.offsetHeight
      });

      clearInterval(messageContentHeightInterval);
    } else {
      addons.getChannel().emit(STORY_CONTENT_LOADED, {
        eventName: STORY_CONTENT_LOADED
        // We do not send a height so that web will use a default height. dsm-storybook
        // doesn't really care what that height is.
      });

      // We may not ever find the container, or the container may not have an `offsetHeight`.
      // This may occur if the user is viewing "Canvas" instead of "Docs." In this situation
      // we want to just stop the interval to prevent a "memory leak."
      retryCount += 1;

      if (retryCount > RETRY_MAX_ATTEMPTS) {
        clearInterval(messageContentHeightInterval);
      }
    }
  }, CONTENT_REFRESH_TIME);
};

export default makeDecorator({
  name: 'withDsm',
  parameterName: DSM_INFO_OBJECT_KEY,
  skipIfNoParametersOrOptions: true,
  wrapper: (getStory, context) => {
    const story = getStory(context);
    emitHtmlSampleCode(story, context);
    emitStoryData(story, context);
    emitStoryLayoutDimensions();
    logger.info(userMessages.decoratorStarted());
    return story;
  }
});
