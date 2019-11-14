// TODO VUE: add cases like children, component in dsmInfo etc and see the react examples too

exports.getSimpleStory = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'simple usage, no knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: { storyTemplate: `<my-button prefix=">>">click me</my-button>` },
      importDeclarations: [{ moduleName: '@storybook/vue', bindings: ['storiesOf'] }]
    },
    expected: {
      componentName: 'my-button',
      props: [{ name: 'prefix', value: '>>' }],
      children: [{ value: 'click me' }],
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

                        <my-button prefix=">>">
                            click me
                        </my-button>

`
      },
      importDeclarations: [{ moduleName: '@storybook/vue', bindings: ['storiesOf'] }]
    },
    expected: {
      componentName: 'my-button',
      props: [{ name: 'prefix', value: '>>' }],
      children: [{ value: '\n                            click me\n                        ' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
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
      frameworkMetadata: { storyTemplate: `<div><div><my-button prefix=">>">click me</my-button></div></div>` },
      importDeclarations: [{ moduleName: '@storybook/vue', bindings: ['storiesOf'] }]
    },
    expected: {
      componentName: 'my-button',
      props: [{ name: 'prefix', value: '>>' }],
      children: [{ value: 'click me' }],
      sourceTemplate: '<div><div>__DSM_INJECTED_SOURCE__</div></div>'
    }
  };
};

exports.getStoryWithExplicitComponentNameWhichDoesNotExist = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'simple usage, no knobs',
      dsmInfo: { id: 'ac3545', component: 'his-button' },
      frameworkMetadata: { storyTemplate: `<div><div><my-button prefix=">>">click me</my-button></div></div>` },
      importDeclarations: [{ moduleName: '@storybook/vue', bindings: ['storiesOf'] }]
    },
    expected: null
  };
};

exports.getStoryWithStoryLevelPropsAsArray = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'with knobs in slot',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-button prefix=">>">content</my-button>`,
        storyLevelProps: "['propA', 'propB']"
      },
      importDeclarations: [{ moduleName: '@storybook/vue', bindings: ['storiesOf'] }]
    },
    expected: {
      componentName: 'my-button',
      props: [{ name: 'prefix', value: '>>' }],
      children: [{ value: 'content' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getSimpleStoryWithKnobInSlot = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'with knobs in slot',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-button prefix=">>">{{textKnob}}</my-button>`,
        storyLevelProps: "{ textKnob: { default: text('title', 'Hello'), type: String } }"
      },
      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'text'] },
        { moduleName: '@storybook/vue', bindings: ['storiesOf'] }
      ]
    },
    expected: {
      componentName: 'my-button',
      props: [{ name: 'prefix', value: '>>' }],
      children: [{ knobLabel: 'title', value: 'Hello' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getSimpleStoryWithSimpleStoryLevelProps = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'with props',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-button prefix=">>">{{propA}}{{propB}}{{propC}}</my-button>`,
        storyLevelProps: '{propA: Number, propB: [String, Number], propC: {type: Number, default: 100} }'
      },
      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'text'] },
        { moduleName: '@storybook/vue', bindings: ['storiesOf'] }
      ]
    },
    expected: {
      componentName: 'my-button',
      props: [{ name: 'prefix', value: '>>' }],
      children: [{ value: '{{propA}}' }, { value: '{{propB}}' }, { value: '{{propC}}' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getStoryWithMultipleChildrenIncludingKnobs = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'with knobs in slot',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-button>{{textKnob1}}{{textKnob2}}<div>blah</div></my-button>`,
        storyLevelProps: "{ textKnob1: { default: text('title1', 'Hello1') }, textKnob2: { default: text('title2', 'Hello2') } }"
      },
      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'text'] },
        { moduleName: '@storybook/vue', bindings: ['storiesOf'] }
      ]
    },
    expected: {
      componentName: 'my-button',
      props: [],
      children: [
        { knobLabel: 'title1', value: 'Hello1' },
        { knobLabel: 'title2', value: 'Hello2' },
        { value: '<div>blah</div>' }
      ],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getStoryWithMultipleChildrenIncludingKnobsAndOtherBindings = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'with knobs in slot',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-button>{{textKnob1}}{{someProp}}<div>blah</div></my-button>`,
        storyLevelProps: "{ textKnob1: { default: text('title1', 'Hello1') }, someProp: 'some value' }"
      },
      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'text'] },
        { moduleName: '@storybook/vue', bindings: ['storiesOf'] }
      ]
    },
    expected: {
      componentName: 'my-button',
      props: [],
      children: [{ knobLabel: 'title1', value: 'Hello1' }, { value: '{{someProp}}' }, { value: '<div>blah</div>' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getStoryWithMultipleChildrenComplexExample1 = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'with knobs in slot',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-button>{{textKnob1}}aaa{{someProp}}</my-button>`,
        storyLevelProps: "{ textKnob1: { default: text('title1', 'Hello1') }, someProp: 'some value' }"
      },
      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'text'] },
        { moduleName: '@storybook/vue', bindings: ['storiesOf'] }
      ]
    },
    expected: {
      componentName: 'my-button',
      props: [],
      children: [{ knobLabel: 'title1', value: 'Hello1' }, { value: 'aaa' }, { value: '{{someProp}}' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getStoryWithMultipleChildrenComplexExample2 = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'with knobs in slot',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-button><div>{{myVar}}</div>{{myVar2}}123{{myVar3}}blah</my-button>`
      },
      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'text'] },
        { moduleName: '@storybook/vue', bindings: ['storiesOf'] }
      ]
    },
    expected: {
      componentName: 'my-button',
      props: [],
      children: [
        { value: '<div>{{myVar}}</div>' },
        { value: '{{myVar2}}' },
        { value: '123' },
        { value: '{{myVar3}}' },
        { value: 'blah' }
      ],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getStoryWithKnobsThatAreNotImported = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'with knobs in slot',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-button>{{textKnob1}}{{textKnob2}}<div>blah</div></my-button>`,
        storyLevelProps: "{ textKnob1: { default: text('title1', 'Hello1') }, textKnob2: { default: text('title2', 'Hello2') } }"
      },
      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'select'] },
        { moduleName: '@storybook/vue', bindings: ['storiesOf'] }
      ]
    },
    expected: {
      componentName: 'my-button',
      props: [],
      children: [{ value: '{{textKnob1}}' }, { value: '{{textKnob2}}' }, { value: '<div>blah</div>' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getSimpleStoryWithKnobInVBind = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'with knobs in bind',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-button v-bind:prefix="textKnob">click me</my-button>`,
        storyLevelProps: "{ textKnob: { default: text('title', 'Hello') } }"
      },
      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'text'] },
        { moduleName: '@storybook/vue', bindings: ['storiesOf'] }
      ]
    },
    expected: {
      componentName: 'my-button',
      props: [{ name: 'prefix', knobLabel: 'title', value: 'Hello' }],
      children: [{ value: 'click me' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getSimpleStoryWithKnobInVBindShorthand = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'with knobs in bind',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-button :prefix="textKnob">click me</my-button>`,
        storyLevelProps: "{ textKnob: { default: text('title', 'Hello') } }"
      },
      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'text'] },
        { moduleName: '@storybook/vue', bindings: ['storiesOf'] }
      ]
    },
    expected: {
      componentName: 'my-button',
      props: [{ name: 'prefix', knobLabel: 'title', value: 'Hello' }],
      children: [{ value: 'click me' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getSimpleStoryWithSpecialPropValues = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'special props',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyTemplate: `<my-button v-bind:class="{'background-color': 'white'}" v-bind:width="200" v-bind:primary="false" v-on:[eventName]="action">{{ getText() }}</my-button>`
      },
      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'text'] },
        { moduleName: '@storybook/vue', bindings: ['storiesOf'] }
      ]
    },
    expected: {
      componentName: 'my-button',
      props: [
        { name: 'v-bind:class', value: "{'background-color': 'white'}" },
        { name: 'v-bind:width', value: '200' },
        { name: 'v-bind:primary', value: 'false' },
        { name: 'v-on:[eventName]', value: 'action' }
      ],
      children: [{ value: '{{getText()}}' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getSimpleStoryWithVPropWithNoValue = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyButton',
      name: 'special props',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        storyLevelProps: "{ textKnob: { default: text('title', 'Hello') } }",
        storyTemplate: `<my-button v-on:click="action" @scroll="action2" :prefix="textKnob" normalProp="123" v-slot:mySlot></my-button>`
      },
      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'text'] },
        { moduleName: '@storybook/vue', bindings: ['storiesOf'] }
      ]
    },
    expected: {
      componentName: 'my-button',
      props: [
        { name: 'v-on:click', value: 'action' },
        { name: '@scroll', value: 'action2' },
        { name: 'prefix', knobLabel: 'title', value: 'Hello' },
        { name: 'normalProp', value: '123' },
        { name: 'v-slot:mySlot' }
      ],
      children: [],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};
