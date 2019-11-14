import applyOptionsResolver from './apply-options-resolver';
import knobsSetEventResolver from './knobs-set-event-resolver';
import onStoryChangedResolver from './on-story-changed-resolver';
import getStorybookPanelsResolver from './get-storybook-panels-resolver';
import getModifiedOptionsResolver from './get-modified-options-resolver';
import getConfigurationFallbackResolver from './get-configuration-fallback-resolver';

const versionResolvers = {
  applyOptionsResolver,
  knobsSetEventResolver,
  onStoryChangedResolver,
  getStorybookPanelsResolver,
  getModifiedOptionsResolver,
  getConfigurationFallbackResolver
};

export { versionResolvers };
