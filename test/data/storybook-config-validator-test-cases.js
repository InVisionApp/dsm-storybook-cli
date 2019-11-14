exports.getSimpleInitDsmV4 = () => {
  return {
    version: '4.1.18',
    sourceCode: `import { configure, addDecorator } from '@storybook/react';

import { initDsm } from '@invisionapp/dsm-storybook';
import { withOptions } from '@storybook/addon-options/src/preview';

function loadStories() {
  require('../src/stories');
}

addDecorator(withOptions({ name: 'global options' }));

initDsm({
  addDecorator,
  callback: () => configure(loadStories, module)
});
`
  };
};

exports.getSimpleInitDsmV5 = () => {
  return {
    version: '5.1.1',
    sourceCode: `import { configure, addDecorator, addParameters } from '@storybook/react';

import { initDsm } from '@invisionapp/dsm-storybook';

function loadStories() {
  require('../src/stories');
}

initDsm({
  addDecorator,
  addParameters,
  callback: () => configure(loadStories, module)
});

`
  };
};

exports.getMoreThanOneCallToInitDsm = () => {
  return {
    version: '4.1.18',
    sourceCode: `import { configure, addDecorator } from '@storybook/react';

import { initDsm } from '@invisionapp/dsm-storybook';
import { withOptions } from '@storybook/addon-options/src/preview';

function loadStories() {
  require('../src/stories');
}

addDecorator(withOptions({ name: 'global options' }));

initDsm({
  addDecorator,
  callback: () => configure(loadStories, module)
});

initDsm({
  addDecorator,
  callback: () => configure(loadStories, module)
});
`
  };
};

exports.getMissingPropertiesInitDsmV4 = () => {
  return {
    version: '4.1.18',
    sourceCode: `import { configure, addDecorator } from '@storybook/react';

import { initDsm } from '@invisionapp/dsm-storybook';
import { withOptions } from '@storybook/addon-options/src/preview';

function loadStories() {
  require('../src/stories');
}

addDecorator(withOptions({ name: 'global options' }));

initDsm({
  callback: () => configure(loadStories, module)
});
`
  };
};

exports.getMissingPropertiesInitDsmV5 = () => {
  return {
    version: '5.1.1',
    sourceCode: `import { configure, addDecorator, addParameters } from '@storybook/react';

import { initDsm } from '@invisionapp/dsm-storybook';

function loadStories() {
  require('../src/stories');
}

initDsm({
  addDecorator,
  callback: () => configure(loadStories, module)
});
`
  };
};

exports.getMoreThanOneParamInitDsm = () => {
  return {
    version: '4.1.18',
    sourceCode: `import { configure, addDecorator } from '@storybook/react';

import { initDsm } from '@invisionapp/dsm-storybook';

function loadStories() {
  require('../src/stories');
}

initDsm(
  {
    addDecorator,
    callback: () => loadStories()
  },
  () => console.log('Another param')
);
`
  };
};

exports.getNoParamsInitDsm = () => {
  return {
    version: '4.1.18',
    sourceCode: `import { configure, addDecorator } from '@storybook/react';

import { initDsm } from '@invisionapp/dsm-storybook';

function loadStories() {
  require('../src/stories');
}

initDsm();
`
  };
};

exports.getNoInitDsm = () => {
  return {
    version: '4.1.18',
    sourceCode: `import { configure, addDecorator } from '@storybook/react';

import { initDsm } from '@invisionapp/dsm-storybook';

function loadStories() {
  require('../src/stories');
}

loadStories();
`
  };
};

exports.getVariableArgumentInitDsm = () => {
  return {
    version: '4.1.18',
    sourceCode: `import { configure, addDecorator } from '@storybook/react';

import { initDsm } from '@invisionapp/dsm-storybook';

function loadStories() {
  require('../src/stories');
}

const config = {
  addDecorator,
  addParameters,
  callback: () => configure(loadStories, module)
};

initDsm(config);
`
  };
};

exports.getExpressionStatementWithoutCalleeInCodeInitDsm = () => {
  return {
    version: '4.1.18',
    sourceCode: `import { configure, addDecorator } from '@storybook/react';

import { initDsm } from '@invisionapp/dsm-storybook';

function loadStories() {
  require('../src/stories');
}

const config = {
  addDecorator,
  addParameters,
  callback: () => configure(loadStories, module)
};

() =>{};

initDsm(config);
`
  };
};

exports.getSimpleOneCallToConfigureInDsm = () => {
  return {
    version: '4.1.18',
    sourceCode: `import { configure, addDecorator } from '@storybook/react';

import { initDsm } from '@invisionapp/dsm-storybook';
import { withOptions } from '@storybook/addon-options/src/preview';

function loadStories() {
  require('../src/stories');
}

addDecorator(withOptions({ name: 'global options' }));

initDsm({
  addDecorator,
  callback: () => configure(loadStories, module)
});
`
  };
};

exports.getSimpleOneCallToConfigureWithoutDsm = () => {
  return {
    version: '4.1.18',
    sourceCode: `import { configure, addDecorator } from '@storybook/react';

import { initDsm } from '@invisionapp/dsm-storybook';
import { withOptions } from '@storybook/addon-options/src/preview';

function loadStories() {
  require('../src/stories');
}

addDecorator(withOptions({ name: 'global options' }));


configure(loadStories, module);
`
  };
};

exports.getMoreThanOneCallToConfigure = () => {
  return {
    version: '4.1.18',
    sourceCode: `import { configure, addDecorator } from '@storybook/react';

import { initDsm } from '@invisionapp/dsm-storybook';
import { withOptions } from '@storybook/addon-options/src/preview';

function loadStories() {
  require('../src/stories');
}

addDecorator(withOptions({ name: 'global options' }));

configure(loadStories, module);

initDsm({
  addDecorator,
  callback: () => configure(loadStories, module)
});
`
  };
};
