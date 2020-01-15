import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { STORY_SELECTED_EVENT, HTML_SAMPLE_CODE_CHANGED_EVENT, FRAMEWORKS } from './constants';
import { getSampleCodeBuilder } from '../sample-code-generation/sample-code-builders';
import CodeHighlight from './CodeHighlight';
import previewDataApiClient from '../services/preview-data-api-client';
import userMessages from '../user-messages';
import { getLanguageByFramework } from './code-highlight-helper';
import { getByVersion, resolvers } from './versions';

export default class SampleCodePanel extends React.Component {
  static propTypes = {
    channel: PropTypes.object,
    api: PropTypes.shape({
      onStory: PropTypes.function
    }),
    active: PropTypes.bool,
    framework: PropTypes.string.isRequired
  };

  state = {
    // The metadata of the story, changed only on new story selection
    sampleCodeMetadata: null,
    // The actual sample code string
    sampleCode: '',
    sampleCodeBuildFailed: false,
    docgenInfo: null
  };

  constructor(props) {
    super(props);

    const { KNOBS_SET_EVENT } = getByVersion(resolvers.knobsSetEvent);
    const { onStoryChanged } = getByVersion(resolvers.onStoryChanged);
    this.KNOBS_SET_EVENT = KNOBS_SET_EVENT;
    this.onStoryChanged = onStoryChanged;
  }

  componentDidMount() {
    const { channel, api, framework } = this.props;

    if (framework === FRAMEWORKS.html) {
      channel.on(HTML_SAMPLE_CODE_CHANGED_EVENT, this.onHtmlSampleCodeChanged);
    } else {
      channel.on(STORY_SELECTED_EVENT, this.onStorySelected);
    }

    channel.on(this.KNOBS_SET_EVENT, this.onKnobSet);

    this.getStoryMetadata();

    // Add a callback to onStory, that clears our state each time a new story is selected.
    // The onStory function returns a function that when called, removed our callback from the onStory event
    this.stopListeningOnStory = this.onStoryChanged(api, (kind, name) => {
      this.setState({ sampleCodeTemplate: '', sampleCode: '', kind, name });
    });
  }

  componentWillUnmount() {
    // Remove our cleanup callback from the onStory event
    if (this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }

    const { channel } = this.props;
    channel.removeListener(STORY_SELECTED_EVENT, this.onStorySelected);
    channel.removeListener(HTML_SAMPLE_CODE_CHANGED_EVENT, this.onHtmlSampleCodeChanged);
    channel.removeListener(this.KNOBS_SET_EVENT, this.onKnobSet);
  }

  onHtmlSampleCodeChanged = ({ sampleCode }) => {
    const { prettierConfig } = this.state;
    this.setState({ ...this.buildSampleCode({ sampleCode }, prettierConfig) });
  };

  onStorySelected = (storyData) => {
    const { storiesMetadata, kind, name, prettierConfig } = this.state;
    const storyMetadata = storiesMetadata.find((story) => {
      return story.sanitizedKind === kind && story.sanitizedName === name;
    });

    if (!storyMetadata) {
      this.setState({ sampleCode: 'Failed to build sample code', sampleCodeMetadata: null });
      return;
    } else if (!storyMetadata.sampleCodeMetadata) {
      this.setState({
        sampleCode: userMessages.sampleCodeNotAvailable(),
        sampleCodeMetadata: null
      });
      return;
    }

    const { sampleCodeMetadata, docgenInfo } = storyMetadata;
    const newState = {
      sampleCodeMetadata,
      docgenInfo: docgenInfo || storyData.docgenInfo
    };

    if (this.storyHasKnobs(sampleCodeMetadata)) {
      this.setState(newState);
    } else {
      this.setState({
        ...newState,
        ...this.buildSampleCode(sampleCodeMetadata, prettierConfig, storyData.docgenInfo ? storyData.docgenInfo.props : {})
      });
    }
  };

  buildSampleCode(sampleCodeMetadata, prettierConfiguration, propsInfo, knobs = null) {
    const { framework } = this.props;
    const sampleCodeBuilder = getSampleCodeBuilder(framework);

    try {
      return {
        sampleCode: sampleCodeBuilder(sampleCodeMetadata, prettierConfiguration, propsInfo, knobs),
        sampleCodeBuildFailed: false
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      return {
        sampleCode: 'Failed to build sample code. Please contact support@invisionapp.com.',
        sampleCodeBuildFailed: true
      };
    }
  }

  getStoryMetadata() {
    previewDataApiClient
      .getStoriesMetadata()
      .then(({ storiesMetadata, prettierConfig }) => {
        this.setState({ storiesMetadata, prettierConfig });
      })
      .catch((e) => {
        this.setState({ storiesMetadata: [], prettierConfig: {} });
        console.log(`Failed to retrieve preview story-data. Error: ${e.message}`);
      });
  }

  storyHasKnobs(sampleCodeMetadata) {
    const propsAndChildren = [...sampleCodeMetadata.props, ...sampleCodeMetadata.children];

    return propsAndChildren.some((item) => {
      return !!item.knobLabel;
    });
  }

  onKnobSet = (knobInfo) => {
    const { knobs } = knobInfo;
    const { sampleCodeMetadata, docgenInfo, prettierConfig } = this.state;

    if (isEmpty(knobs) || !sampleCodeMetadata) {
      return;
    }

    this.setState({ ...this.buildSampleCode(sampleCodeMetadata, prettierConfig, docgenInfo ? docgenInfo.props : {}, knobs) });
  };

  render() {
    const { sampleCode } = this.state;
    const { active, framework } = this.props;

    return active ? <CodeHighlight language={getLanguageByFramework(framework)}>{sampleCode}</CodeHighlight> : null;
  }
}
