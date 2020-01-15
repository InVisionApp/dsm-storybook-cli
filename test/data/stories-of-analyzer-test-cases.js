const path = require('path');

exports.getSimpleStory = function(withDsm) {
  const dsmInfo = withDsm ? `{ 'in-dsm': { id: 'abc1', n: { nid: 6 } } }` : `{}`;
  const testCase = {
    sourceFile: path.basename(__filename),
    storySource: `
  const React = require('react');
  const { storiesOf, action } = require('@storybook/react');
  import Icon from '../Icon';
  
  storiesOf('Icon', module)
    .add('default svg color', () => {
      return <Icon glyph="type-symbol" />;
    }, ${dsmInfo})
    .add('inherit color', () => {
      return (
        <Icon color="pink" glyph="search" size={48} />
      );
    }, ${dsmInfo});`,
    expected: {}
  };
  if (withDsm) {
    testCase.expected = {
      importDeclarations: [
        { moduleName: '@storybook/react', bindings: ['storiesOf', 'action'] },
        { moduleName: 'react', bindings: ['React'] },
        { moduleName: '../Icon', bindings: ['Icon'] }
      ],
      stories: [
        {
          externalComponentId: 'abc1',
          kind: 'Icon',
          name: 'inherit color',
          dsmInfo: {
            id: 'abc1',
            docgenInfo: undefined,
            n: {
              nid: 6
            }
          },
          frameworkMetadata: { returnStatement: '<Icon color="pink" glyph="search" size={48} />' }
        },
        {
          externalComponentId: 'abc1',
          kind: 'Icon',
          name: 'default svg color',
          dsmInfo: { id: 'abc1', docgenInfo: undefined, n: { nid: 6 } },
          frameworkMetadata: { returnStatement: '<Icon glyph="type-symbol" />' }
        }
      ]
    };
  }
  return testCase;
};

exports.getSimpleStoryWithNamespaceStoriesOf = function(withDsm) {
  const dsmInfo = withDsm ? `{ 'in-dsm': { id: 'abc1', n: { nid: 6 } } }` : `{}`;
  const testCase = {
    sourceFile: path.basename(__filename),
    storySource: `
  const React = require('react');
  import * as storybook from '@storybook/react';
  import Icon from '../Icon';
  
  storybook.storiesOf('Icon', module)
    .add('default svg color', () => {
      return <Icon glyph="type-symbol" />;
    }, ${dsmInfo})
    .add('inherit color', () => {
      return (
        <Icon color="pink" glyph="search" size={48} />
      );
    }, ${dsmInfo});`,
    expected: {}
  };
  if (withDsm) {
    testCase.expected = {
      importDeclarations: [
        { moduleName: '@storybook/react', bindings: ['storybook'] },
        { moduleName: 'react', bindings: ['React'] },
        { moduleName: '../Icon', bindings: ['Icon'] }
      ],
      stories: [
        {
          externalComponentId: 'abc1',
          kind: 'Icon',
          name: 'inherit color',
          dsmInfo: {
            id: 'abc1',
            docgenInfo: undefined,
            n: {
              nid: 6
            }
          },
          frameworkMetadata: { returnStatement: '<Icon color="pink" glyph="search" size={48} />' }
        },
        {
          externalComponentId: 'abc1',
          kind: 'Icon',
          name: 'default svg color',
          dsmInfo: { id: 'abc1', docgenInfo: undefined, n: { nid: 6 } },
          frameworkMetadata: { returnStatement: '<Icon glyph="type-symbol" />' }
        }
      ]
    };
  }
  return testCase;
};

exports.getLastStoryIsDsmStory = function() {
  return {
    sourceFile: path.basename(__filename),
    storySource: `
  import React from 'react';
  import { storiesOf, action } from '@storybook/react';
  import Icon from '../Icon';
  
  storiesOf('Icon', module)
    .add('default svg color', () => {
      return <Icon glyph="type-symbol" />;
    })
    .add('inherit color', () => {
      return (
        <Icon color="pink" glyph="search" size={48} />
      );
    }, { 'in-dsm': { id: 'abc1', n: { nid: 6 } } });`,
    expected: {
      importDeclarations: [
        { moduleName: '@storybook/react', bindings: ['storiesOf', 'action'] },
        { moduleName: '../Icon', bindings: ['Icon'] },
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

exports.getFirstStoryIsDsmStory = function() {
  return {
    sourceFile: path.basename(__filename),
    storySource: `
  import React from 'react';
  import { storiesOf, action } from '@storybook/react';
  import Icon from '../Icon';
  
  storiesOf('Icon', module)
    .add('default svg color', () => {
      return <Icon glyph="type-symbol" />;
    }, { 'in-dsm': { id: 'abc1', n: { nid: 6 } } })
    .add('inherit color', () => {
      return (
        <Icon color="pink" glyph="search" size={48} />
      );
    });`,
    expected: {
      importDeclarations: [
        { moduleName: '@storybook/react', bindings: ['storiesOf', 'action'] },
        { moduleName: '../Icon', bindings: ['Icon'] },
        { moduleName: 'react', bindings: ['React'] }
      ],
      stories: [
        {
          externalComponentId: 'abc1',
          kind: 'Icon',
          name: 'default svg color',
          dsmInfo: { id: 'abc1', docgenInfo: undefined, n: { nid: 6 } },
          frameworkMetadata: { returnStatement: '<Icon glyph="type-symbol" />' }
        }
      ]
    }
  };
};

exports.getStoryWithSupportedImportDeclarations = function() {
  return {
    sourceFile: path.basename(__filename),
    storySource: `
  import React from 'react';
  import { storiesOf, action } from '@storybook/react';
  import Icon from '../Icon';

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
 
  storiesOf('Icon', module)
    .add('default svg color', () => {
      return <Icon glyph="type-symbol" />;
    }, { 'in-dsm': { id: 'abc1', n: { nid: 6 } } });`,
    expected: {
      importDeclarations: [
        { moduleName: '@storybook/react', bindings: ['storiesOf', 'action'] },
        { moduleName: '../Icon', bindings: ['Icon'] },
        { moduleName: 'react', bindings: ['React'] },
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
          externalComponentId: 'abc1',
          kind: 'Icon',
          name: 'default svg color',
          dsmInfo: { id: 'abc1', docgenInfo: undefined, n: { nid: 6 } },
          frameworkMetadata: { returnStatement: '<Icon glyph="type-symbol" />' }
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
 
  storiesOf('Icon', module)
    .add('default svg color', () => {
      return <Icon glyph="type-symbol" />;
    }, { 'in-dsm': { id: 'abc1', n: { nid: 6 } } });`,
    expected: undefined
  };
};

exports.getStoryWithComplexInfoProps = function() {
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
    }, { info: { propTablesExclude: [Container] }, 'in-dsm': { id: 'abc1', n: { nid: 6 } } });`,
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

exports.getStoryWithNamedStoriesOfAssignedToVariable = function() {
  return {
    sourceFile: path.basename(__filename),
    storySource: `
  import React from 'react';
  import { storiesOf } from '@storybook/react';
  import Icon from '../Icon';

  const story = storiesOf('Icon', module);
  
  story
    .add('default svg color', () => {
      return <Icon glyph="type-symbol" />;
    })
    .add('inherit color', () => {
      return (
        <Icon color="pink" glyph="search" size={48} />
      );
    }, { 'in-dsm': { id: 'abc1', n: { nid: 6 } } });`,
    expected: {
      importDeclarations: [
        { moduleName: '@storybook/react', bindings: ['storiesOf'] },
        { moduleName: '../Icon', bindings: ['Icon'] },
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

exports.getStoryWithNamespaceStoriesOfAssignedToVariable = function() {
  return {
    sourceFile: path.basename(__filename),
    storySource: `
  import React from 'react';
  import * as storybook from '@storybook/react';
  import Icon from '../Icon';

  const story = storybook.storiesOf('Icon', module);
  
  story
    .add('default svg color', () => {
      return <Icon glyph="type-symbol" />;
    })
    .add('inherit color', () => {
      return (
        <Icon color="pink" glyph="search" size={48} />
      );
    }, { 'in-dsm': { id: 'abc1', n: { nid: 6 } } });`,
    expected: {
      importDeclarations: [
        { moduleName: '@storybook/react', bindings: ['storybook'] },
        { moduleName: '../Icon', bindings: ['Icon'] },
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
