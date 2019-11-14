const chai = require('chai');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
chai.use(deepEqualInAnyOrder);
const { assert, expect } = chai;

const getStorybookFramework = require('../src/cli/storybook-framework-detector');

const storybookDependencies = [
  {
    name: '@storybook/addon-a11y',
    version: '5.1.9'
  },
  {
    name: '@storybook/addon-knobs',
    version: '5.1.9'
  },
  {
    name: '@storybook/addons',
    version: '5.1.9'
  },
  {
    name: '@storybook/react',
    version: '5.1.9'
  }
];

const storybookDependenciesWithMoreThanOneFramework = [
  ...storybookDependencies,
  {
    name: '@storybook/html',
    version: '5.1.9'
  }
];

describe('Storybook framework detector tests', function() {
  it('simple case - detect one installed storybook framework', function() {
    const configuration = {};
    const framework = getStorybookFramework(storybookDependencies, configuration);
    expect(framework).to.equalInAnyOrder({ name: 'react', version: '5.1.9' });
  });

  it('framework provided', function() {
    const configuration = { framework: 'react' };
    const framework = getStorybookFramework(storybookDependencies, configuration);
    expect(framework).to.equalInAnyOrder({ name: 'react', version: '5.1.9' });
  });

  it('framework provided is in upper case', function() {
    const configuration = { framework: 'REACT' };
    const framework = getStorybookFramework(storybookDependencies, configuration);
    expect(framework).to.equalInAnyOrder({ name: 'react', version: '5.1.9' });
  });

  it('framework provided and more than one framework dependency installed', function() {
    const configuration = { framework: 'html' };
    const framework = getStorybookFramework(storybookDependenciesWithMoreThanOneFramework, configuration);
    expect(framework).to.equalInAnyOrder({ name: 'html', version: '5.1.9' });
  });

  it('framework provided is incorrect but there is only one installed framework so we extract it', function() {
    const configuration = { framework: 'react-is-nice' };
    const framework = getStorybookFramework(storybookDependencies, configuration);
    expect(framework).to.equalInAnyOrder({ name: 'react', version: '5.1.9' });
  });
});
