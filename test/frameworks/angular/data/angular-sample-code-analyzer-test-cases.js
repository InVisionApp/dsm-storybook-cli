exports.getStoryWithNoTemplate = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'no template',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {},
      importDeclarations: [{ moduleName: '@storybook/angular', bindings: ['storiesOf'] }]
    },
    expected: null
  };
};

exports.getSimpleStory = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'simple usage, no knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: { storyTemplate: `<my-button type="primary" tooltip="click me">start</my-button>` },
      importDeclarations: [{ moduleName: '@storybook/angular', bindings: ['storiesOf'] }]
    },
    expected: {
      componentName: 'my-button',
      props: [{ name: 'type', value: 'primary' }, { name: 'tooltip', value: 'click me' }],
      children: [{ value: 'start' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getSimpleStoryWithNewlinesInTemplate = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'simple usage, no knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `
<my-button type="primary" text="click me">
start
</my-button>
`
      },
      importDeclarations: [{ moduleName: '@storybook/angular', bindings: ['storiesOf'] }]
    },
    expected: {
      componentName: 'my-button',
      props: [{ name: 'type', value: 'primary' }, { name: 'text', value: 'click me' }],
      children: [{ value: '\nstart\n' }],
      sourceTemplate: '\n__DSM_INJECTED_SOURCE__\n'
    }
  };
};

exports.getStoryWithExplicitComponentName = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'simple usage, no knobs',
      dsmInfo: { id: 'ac3545', component: 'my-button' },
      frameworkMetadata: {
        storyTemplate: `<div><div><my-button type="primary" tooltip="click me">start</my-button></div></div>`
      },
      importDeclarations: [{ moduleName: '@storybook/angular', bindings: ['storiesOf'] }]
    },
    expected: {
      componentName: 'my-button',
      props: [{ name: 'type', value: 'primary' }, { name: 'tooltip', value: 'click me' }],
      children: [{ value: 'start' }],
      sourceTemplate: '<div><div>__DSM_INJECTED_SOURCE__</div></div>'
    }
  };
};

exports.getStoryWithNoRootTagInTemplateWithExplicitComponentName = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'simple usage, no knobs',
      dsmInfo: { id: 'ac3545', component: 'my-button' },
      frameworkMetadata: {
        storyTemplate: `<div><div>blah blah</div></div><my-button type="primary" tooltip="click me">start</my-button><p>hola</p>`
      },
      importDeclarations: [{ moduleName: '@storybook/angular', bindings: ['storiesOf'] }]
    },
    expected: {
      componentName: 'my-button',
      props: [{ name: 'type', value: 'primary' }, { name: 'tooltip', value: 'click me' }],
      children: [{ value: 'start' }],
      sourceTemplate: '<div><div>blah blah</div></div>__DSM_INJECTED_SOURCE__<p>hola</p>'
    }
  };
};

exports.getStoryWithNoRootTagInTemplateWithNoExplicitComponentName = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'simple usage, no knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<div><div>blah blah</div></div><my-button type="primary" tooltip="click me">start</my-button><p>hola</p>`
      },
      importDeclarations: [{ moduleName: '@storybook/angular', bindings: ['storiesOf'] }]
    },
    expected: null
  };
};

exports.getStoryWithExplicitComponentNameWhichDoesNotExist = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'simple usage, no knobs',
      dsmInfo: { id: 'ac3545', component: 'other-button' },
      frameworkMetadata: {
        storyTemplate: `<div><div><my-button type="primary" tooltip="click me">start</my-button></div></div>`
      },
      importDeclarations: [{ moduleName: '@storybook/angular', bindings: ['storiesOf'] }]
    },
    expected: null
  };
};

exports.getStoryWithBindingInChildren = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'simple usage, no knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: { storyTemplate: `<my-button tooltip="click me">{{text}}</my-button>` },
      importDeclarations: [{ moduleName: '@storybook/angular', bindings: ['storiesOf'] }]
    },
    expected: {
      componentName: 'my-button',
      props: [{ name: 'tooltip', value: 'click me' }],
      children: [{ value: '{{text}}' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getStoryWithElementsInChildren = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'simple usage, no knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: { storyTemplate: `<my-button tooltip="click me"><p>1</p><div>2</div></my-button>` },
      importDeclarations: [{ moduleName: '@storybook/angular', bindings: ['storiesOf'] }]
    },
    expected: {
      componentName: 'my-button',
      props: [{ name: 'tooltip', value: 'click me' }],
      children: [{ value: '<p>1</p>' }, { value: '<div>2</div>' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getStoryWithPropertyAndEventBinding = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'simple usage, no knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-button [type]="selectedType" (click)="onStart()" tooltip="click me">start</my-button>`
      },
      importDeclarations: [{ moduleName: '@storybook/angular', bindings: ['storiesOf'] }]
    },
    expected: {
      componentName: 'my-button',
      props: [
        { name: '[type]', value: 'selectedType' },
        { name: '(click)', value: 'onStart()' },
        { name: 'tooltip', value: 'click me' }
      ],
      children: [{ value: 'start' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

// currently not working as expected (test is disabled until we decide if we want to support this)
exports.getStoryWithTwoWayBinding = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'simple usage, no knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-input [(value)]="username"></my-input>`
      },
      importDeclarations: [{ moduleName: '@storybook/angular', bindings: ['storiesOf'] }]
    },
    expected: {
      componentName: 'my-input',
      props: [{ name: '[(value)]', value: 'username' }],
      children: [],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getStoryWithAttributeDirective = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'simple usage, no knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: { storyTemplate: `<my-button primary tooltip="click me">start</my-button>` },
      importDeclarations: [{ moduleName: '@storybook/angular', bindings: ['storiesOf'] }]
    },
    expected: {
      componentName: 'my-button',
      props: [{ name: 'primary' }, { name: 'tooltip', value: 'click me' }],
      children: [{ value: 'start' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getStoryWithStoryLevelPropsWithoutKnobs = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'with knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-button [text]="buttonText"></my-button>`,
        storyLevelProps: "{ buttonText: 'hello' }"
      },
      importDeclarations: [
        { moduleName: '@storybook/angular', bindings: ['storiesOf'] },
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'text'] }
      ]
    },
    expected: {
      componentName: 'my-button',
      props: [{ name: '[text]', value: 'buttonText' }],
      children: [],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

// with knobs

exports.getSimpleStoryWithKnobInChildren = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'with knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-button tooltip="click me">{{buttonText}}</my-button>`,
        storyLevelProps: "{ buttonText: text('button text', 'Hello NG Button') }"
      },
      importDeclarations: [
        { moduleName: '@storybook/angular', bindings: ['storiesOf'] },
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'text'] }
      ]
    },
    expected: {
      componentName: 'my-button',
      props: [{ name: 'tooltip', value: 'click me' }],
      children: [{ knobLabel: 'button text', value: 'Hello NG Button' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getStoryWithKnobInProp = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'with knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-button [text]="buttonText"></my-button>`,
        storyLevelProps: "{ buttonText: text('button text', 'Hello NG Button') }"
      },
      importDeclarations: [
        { moduleName: '@storybook/angular', bindings: ['storiesOf'] },
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'text'] }
      ]
    },
    expected: {
      componentName: 'my-button',
      props: [{ name: '[text]', knobLabel: 'button text', value: 'Hello NG Button' }],
      children: [],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getStoryWithKnobInPropThatIsNotImported = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'with knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-button [text]="buttonText"></my-button>`,
        storyLevelProps: "{ buttonText: text('button text', 'Hello NG Button') }"
      },
      importDeclarations: [
        { moduleName: '@storybook/angular', bindings: ['storiesOf'] },
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'select'] }
      ]
    },
    expected: {
      componentName: 'my-button',
      props: [{ name: '[text]', value: 'buttonText' }],
      children: [],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

// TODO Angular: currently we have basic support for knobs as children when there is more than one BoundText
// (see for example in the expected result how all the first children are grouped here)
// we could add more sophisticated support (ie more than one expression in the BoundText AST),
// and then many more edge cases should be tested
exports.getStoryWithMultipleChildrenIncludingKnobs = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'with knobs in slot',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-button>{{prop1}}{{knob1}}{{1+2}}{{getText()}}<p>blah</p>{{knob2}}</my-button>`,
        storyLevelProps: "{ knob1: text('button text', 'Hello'), prop1: 'value1', knob2: number('font-size', 20)}"
      },
      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'text', 'number'] },
        { moduleName: '@storybook/angular', bindings: ['storiesOf'] }
      ]
    },
    expected: {
      componentName: 'my-button',
      props: [],
      children: [
        { value: '{{prop1}}{{knob1}}{{1+2}}{{getText()}}' },
        { value: '<p>blah</p>' },
        { knobLabel: 'font-size', value: 20 }
      ],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getStorySelfClosingTagInChildren = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'with self closing tag',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-button>
    <hr>
    <input>
    <img>
    <div></div>
</my-button>`
      },
      importDeclarations: [{ moduleName: '@storybook/angular', bindings: ['storiesOf'] }]
    },
    expected: {
      componentName: 'my-button',
      props: [],
      children: [{ value: '<hr>' }, { value: '<input>' }, { value: '<img>' }, { value: '<div></div>' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getStoryWithAllTemplateBindingsAndKnobs = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'with knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-button [(status)]="statusKnob" [text]="textKnob" tooltip="click me">{{buttonText}}</my-button>`,
        storyLevelProps:
          "{ buttonText: text('button text', 'Hello NG Button'), textKnob: text('text', 'This is a notification message'), statusKnob: text('text', 'success') }"
      },
      importDeclarations: [
        { moduleName: '@storybook/angular', bindings: ['storiesOf'] },
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'text'] }
      ]
    },
    expected: {
      componentName: 'my-button',
      props: [
        { name: 'tooltip', value: 'click me' },
        { name: '[(status)]', value: 'success', knobLabel: 'text' },
        { name: '[text]', value: 'This is a notification message', knobLabel: 'text' }
      ],
      children: [{ knobLabel: 'button text', value: 'Hello NG Button' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};
