import semver from 'semver';
import * as v4_0_0 from '../v4.0.0/get-storybook-panels';
import * as v5_1_1 from '../v5.1.1/get-storybook-panels';

export default (storybookVersion) => {
  if (semver.satisfies(storybookVersion, '^4.0.0')) {
    return v4_0_0;
  }

  if (semver.satisfies(storybookVersion, '^5.1.1 || ^6.0.0')) {
    return v5_1_1;
  }
};
