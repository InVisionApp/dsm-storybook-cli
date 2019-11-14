const path = require('path');

exports.getSimpleStoryWithoutDsm = function() {
  return {
    sourceFile: path.basename(__filename),
    storySource: `
import React from 'react';
import { action } from '@storybook/addon-actions';
import Button from '../components/Button';

const test1 = () => <Button onClick={action('clicked')}>Button Test 1</Button>;
test1.story = { name: 'test 1' };

const test2 = () => <Button onClick={action('clicked')}>Button Test 2</Button>;
test2.story = { name: 'test 2' };

const test3 = () => <Button onClick={action('clicked')}>Button Test 3</Button>;
test3.story = {};
test3.story.name = 'test 3';

export const test4 = () => <Button onClick={action('clicked')}>Button Test 4</Button>;
test4.story = {};
test4.story.name = 'SUPPORTED!!! Wooohoooo!';

export const test5 = () => <Button onClick={action('clicked')}>Button Test 5</Button>;

export const emoji = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);

const notAStory = () => <Button onClick={action('clicked')}>Not a story</Button>;

export { test1, test2, test3 };

export default {
  title: 'Something|SB Button/Doc/Lol',
  parameters: { component: Button }
};
`,
    expected: {}
  };
};

exports.getSimpleStoryWithDsm = function() {
  return {
    sourceFile: path.basename(__filename),
    storySource: `
import React from 'react';
import { action } from '@storybook/addon-actions';
import Button from '../components/Button';

const something = { testing: 2 };

const test1 = () => <Button onClick={action('clicked')}>Button Test 1</Button>;
test1.story = { name: 'test 1', parameters: { 'in-dsm': { id: '1', n: { nid: 6 } } } };

const test2 = () => <Button onClick={action('clicked')}>Button Test 2</Button>;
test2.story = { name: 'test 2', parameters: { 'in-dsm': { id: '2', n: { nid: 6 } } } };

const test3 = () => <Button onClick={action('clicked')}>Button Test 3</Button>;
test3.story = {};
test3.story.name = 'test 3';
test3.story.parameters = {};
test3.story.parameters['in-dsm'] = { id: '3', version: '1.0.33' };
// Ignored
test3.story.parameters[something.testing] = { name: 'something' };

export const test4 = () => <Button onClick={action('clicked')}>Button Test 4</Button>;
test4.story = {};
test4.story.name = 'SUPPORTED!!! Wooohoooo!';
test4.story.parameters = {};
test4.story.parameters['in-dsm'] = { id: '4', version: '1.0.5' };
test4.story.parameters['in-dsm'].id = 'override4';

export const test5 = () => <Button onClick={action('clicked')}>Button Test 5</Button>;

export const emoji = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);

const notAStory = () => <Button onClick={action('clicked')}>Not a story</Button>;

export { test1, test2, test3 };

export default {
  title: 'Something|SB Button/Doc/Lol',
  parameters: { component: Button, 'in-dsm': { id: 'global' } }
};
`,
    expected: {
      importDeclarations: [
        { moduleName: '@storybook/addon-actions', bindings: ['action'] },
        { moduleName: 'react', bindings: ['React'] },
        { moduleName: '../components/Button', bindings: ['Button'] }
      ],
      stories: [
        {
          externalComponentId: '1',
          kind: 'Something|SB Button/Doc/Lol',
          name: 'Test 1',
          displayName: 'test 1',
          dsmInfo: {
            id: '1',
            docgenInfo: undefined,
            n: {
              nid: 6
            }
          },
          frameworkMetadata: { returnStatement: `<Button onClick={action('clicked')}>Button Test 1</Button>` }
        },
        {
          externalComponentId: '2',
          kind: 'Something|SB Button/Doc/Lol',
          name: 'Test 2',
          displayName: 'test 2',
          dsmInfo: {
            id: '2',
            docgenInfo: undefined,
            n: {
              nid: 6
            }
          },
          frameworkMetadata: { returnStatement: `<Button onClick={action('clicked')}>Button Test 2</Button>` }
        },
        {
          externalComponentId: '3',
          kind: 'Something|SB Button/Doc/Lol',
          name: 'Test 3',
          displayName: 'test 3',
          dsmInfo: {
            id: '3',
            docgenInfo: undefined,
            version: '1.0.33'
          },
          frameworkMetadata: { returnStatement: `<Button onClick={action('clicked')}>Button Test 3</Button>` }
        },
        {
          externalComponentId: 'override4',
          kind: 'Something|SB Button/Doc/Lol',
          name: 'Test 4',
          displayName: 'SUPPORTED!!! Wooohoooo!',
          dsmInfo: {
            id: 'override4',
            docgenInfo: undefined,
            version: '1.0.5'
          },
          frameworkMetadata: { returnStatement: `<Button onClick={action('clicked')}>Button Test 4</Button>` }
        },
        {
          externalComponentId: 'global',
          kind: 'Something|SB Button/Doc/Lol',
          name: 'Test 5',
          dsmInfo: {
            id: 'global',
            docgenInfo: undefined
          },
          frameworkMetadata: { returnStatement: `<Button onClick={action('clicked')}>Button Test 5</Button>` }
        },
        {
          externalComponentId: 'global',
          kind: 'Something|SB Button/Doc/Lol',
          name: 'Emoji',
          dsmInfo: {
            id: 'global',
            docgenInfo: undefined
          },
          frameworkMetadata: {
            returnStatement: `<Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>`
          }
        }
      ]
    }
  };
};

exports.getSimpleStoryWithIncorrectInDsm = function() {
  return {
    sourceFile: path.basename(__filename),
    storySource: `
import React from 'react';
import { action } from '@storybook/addon-actions';
import Button from '../components/Button';

export const test = () => <Button onClick={action('clicked')}>Button Test</Button>;
test2.story = { name: 'Test!', 'in-dsm': { id: '1' } };

export default {
  title: 'Something|SB Button/Doc/Lol',
  'in-dsm': { id: 'global' },
  parameters: { component: Button }
};
`,
    expected: {}
  };
};

exports.getStoryWithSupportedImportDeclarations = function() {
  return {
    sourceFile: path.basename(__filename),
    storySource: `
  import React from 'react';
  import { action } from '@storybook/addon-actions';
  import Button from '../components/Button';

  // default imports
  import foo from "foo";
  import {default as foo1} from "foo";
 
   // named imports
  import {bar} from "foo";
  import {bar1, baz} from "foo";
  import {bar as baz1} from "foo";
  import {bar as baz2, xyz} from "foo";
  
  // glob imports
  import * as foo2 from "foo";
  
  // mixing imports
  import foo3, {baz as xyz1} from "foo";

  export const button = () => <Button onClick={action('clicked')}>Button Test 5</Button>;

  export default {
    title: 'Something|SB Button/Doc/Lol',
    parameters: { component: Button, 'in-dsm': { id: 'global' } }
  };`,
    expected: {
      importDeclarations: [
        { moduleName: '@storybook/addon-actions', bindings: ['action'] },
        { moduleName: 'react', bindings: ['React'] },
        { moduleName: '../components/Button', bindings: ['Button'] },
        { moduleName: 'foo', bindings: ['bar'] },
        { moduleName: 'foo', bindings: ['bar'] },
        { moduleName: 'foo', bindings: ['default'] },
        { moduleName: 'foo', bindings: ['foo'] },
        { moduleName: 'foo', bindings: ['bar', 'xyz'] },
        { moduleName: 'foo', bindings: ['bar1', 'baz'] },
        { moduleName: 'foo', bindings: ['baz', 'foo3'] },
        { moduleName: 'foo', bindings: ['foo2'] }
      ],
      stories: [
        {
          externalComponentId: 'global',
          kind: 'Something|SB Button/Doc/Lol',
          name: 'Button',
          dsmInfo: { id: 'global', docgenInfo: undefined },
          frameworkMetadata: { returnStatement: `<Button onClick={action('clicked')}>Button Test 5</Button>` }
        }
      ]
    }
  };
};

exports.getStoryWithInvalidImportDeclarations = function() {
  return {
    sourceFile: path.basename(__filename),
    storySource: `
  
  // mixing imports
  import * as bar9, {baz as xyz9} from "foo";
  import foo4, * as bar3, {baz as xyz3} from "foo";
 
  export const button = () => <Button onClick={action('clicked')}>Button Test 5</Button>;

  export default {
    title: 'Something|SB Button/Doc/Lol',
    parameters: { component: Button, 'in-dsm': { id: 'global' } }
  };`,
    expected: undefined
  };
};

exports.getStoryWithComplexInfoProps = function() {
  return {
    sourceFile: path.basename(__filename),
    storySource: `
  import React from 'react';
  import { action } from '@storybook/addon-actions';
  import Button from '../components/Button';
  import Container from '../Container';

  export const button = () => <Button onClick={action('clicked')}>Button Test 5</Button>;

  export default {
    title: 'Something|SB Button/Doc/Lol',
    parameters: { component: Button, info: { propTablesExclude: [Container] }, 'in-dsm': { id: 'global' } }
  };`,
    expected: {
      importDeclarations: [
        { moduleName: '@storybook/addon-actions', bindings: ['action'] },
        { moduleName: 'react', bindings: ['React'] },
        { moduleName: '../components/Button', bindings: ['Button'] },
        { moduleName: '../Container', bindings: ['Container'] }
      ],
      stories: [
        {
          externalComponentId: 'global',
          kind: 'Something|SB Button/Doc/Lol',
          name: 'Button',
          dsmInfo: { id: 'global', docgenInfo: undefined },
          frameworkMetadata: { returnStatement: `<Button onClick={action('clicked')}>Button Test 5</Button>` }
        }
      ]
    }
  };
};

exports.getStoryWithComplexInfoPropsInsideInDsm = function() {
  return {
    sourceFile: path.basename(__filename),
    storySource: `
  import React from 'react';
  import { storiesOf, action } from '@storybook/react';
  import Icon from '../Icon';
  import Container from '../Container';
  
  storiesOf('Icon', module)
    .add('default svg color', () => {
      return <Icon glyph="type-symbol" />;
    })
    .add('inherit color', () => {
      return (
        <Icon color="pink" glyph="search" size={48} />
      );
    }, { info: { propTablesExclude: [Container] }, 'in-dsm': { id: 'abc1', n: { nid: 6 }, someArray: [Container] } });`,
    expected: {
      importDeclarations: [
        { moduleName: '@storybook/react', bindings: ['storiesOf', 'action'] },
        { moduleName: '../Icon', bindings: ['Icon'] },
        { moduleName: '../Container', bindings: ['Container'] },
        { moduleName: 'react', bindings: ['React'] }
      ],
      stories: [
        {
          externalComponentId: 'abc1',
          kind: 'Icon',
          name: 'inherit color',
          dsmInfo: { id: 'abc1', docgenInfo: undefined, n: { nid: 6 } },
          frameworkMetadata: { returnStatement: '<Icon color="pink" glyph="search" size={48} />' }
        }
      ]
    }
  };
};
