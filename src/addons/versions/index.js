import { environmentKeys, getByEnvKey } from '../../services/configuration';
import { UnsupportedVersionError } from '../../services/version-resolvers-errors';
import { versionResolvers } from './version-resolvers';

const getByVersion = (resolver) => {
  const storybookVersion = getByEnvKey(environmentKeys.storybookVersion);
  const result = versionResolvers[resolver](storybookVersion);
  if (!result) {
    throw new UnsupportedVersionError(storybookVersion);
  }

  return result;
};

const resolvers = {
  knobsSetEvent: 'knobsSetEventResolver',
  applyOptions: 'applyOptionsResolver',
  onStoryChanged: 'onStoryChangedResolver',
  getStorybookPanels: 'getStorybookPanelsResolver',
  getModifiedOptions: 'getModifiedOptionsResolver',
  getConfigurationFallback: 'getConfigurationFallbackResolver'
};

export { getByVersion, resolvers };
