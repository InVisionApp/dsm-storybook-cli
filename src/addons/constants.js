const DSM_ADDON_NAME = 'invision-dsm';
const DSM_INFO_OBJECT_KEY = 'in-dsm';
const STORY_SELECTED_EVENT = `${DSM_ADDON_NAME}/on_story_selected`;
const HTML_SAMPLE_CODE_CHANGED_EVENT = `${DSM_ADDON_NAME}/on_html_sample_code_changed`;
const INIT_DSM_REGISTERED_EVENT = `${DSM_ADDON_NAME}/on_init_dsm_registered`;
const INIT_DSM_EVENT = `${DSM_ADDON_NAME}/on_init_dsm`;
const INJECTED_SOURCE_PLACEHOLDER = '__DSM_INJECTED_SOURCE__';
const KNOBS_SET_EVENT = 'addon:knobs:setKnobs';
const KNOBS_SET_EVENT_V5_1 = 'storybookjs/knobs/set';
const STORY_CHANGED_EVENT = 'storyChanged';
const STORYBOOK_ENV_VARIABLE = 'STORYBOOK_DSM';
const WINDOW_MODES = { normal: 'normal', fullscreen: 'fullscreen' };
const WINDOW_MODE_PARAM = 'mode';
const FRAMEWORKS = { html: 'html', react: 'react', angular: 'angular', vue: 'vue' };

module.exports = {
  DSM_ADDON_NAME,
  DSM_INFO_OBJECT_KEY,
  STORY_SELECTED_EVENT,
  HTML_SAMPLE_CODE_CHANGED_EVENT,
  INIT_DSM_REGISTERED_EVENT,
  INIT_DSM_EVENT,
  INJECTED_SOURCE_PLACEHOLDER,
  KNOBS_SET_EVENT,
  KNOBS_SET_EVENT_V5_1,
  STORY_CHANGED_EVENT,
  STORYBOOK_ENV_VARIABLE,
  WINDOW_MODES,
  WINDOW_MODE_PARAM,
  FRAMEWORKS
};
