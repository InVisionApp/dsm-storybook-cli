import semver from 'semver';
import * as v4_0_0 from '../v4.0.0/get-configuration-fallback';
import * as v5_1_1 from '../v5.1.1/get-configuration-fallback';
import * as v5_3_0 from '../v5.3.0/get-configuration-fallback';
import { getByEnvKey, environmentKeys } from '../../../services/configuration';

export default (storybookVersion) => {
  const isUsingDeclarativeConfiguration = getByEnvKey(environmentKeys.isUsingDeclarativeConfiguration);

  if (semver.satisfies(storybookVersion, '^4.0.0')) {
    return v4_0_0;
  }

  if (semver.satisfies(storybookVersion, '^5.1.1 || ^6.0.0')) {
    // We need to handle both configuration mechanisms until Storybook deprecates the legacy configuration
    if (isUsingDeclarativeConfiguration) {
      return v5_3_0;
    }

    return v5_1_1;
  }
};
