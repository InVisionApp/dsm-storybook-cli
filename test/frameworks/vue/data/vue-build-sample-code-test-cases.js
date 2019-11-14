exports.getSimpleStory = function() {
  return {
    metadata: {
      componentName: 'my-div',
      props: [{ name: 'bgColor', value: 'blue' }],
      children: [{ value: 'div content' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    },
    expected: `<my-div bgColor="blue">div content</my-div>
`
  };
};

exports.getSimpleStoryWithoutChildren = function() {
  return {
    metadata: {
      componentName: 'title',
      props: [{ name: 'text', value: 'hello world' }],
      children: [],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    },
    expected: `<title text="hello world"></title>
`
  };
};

exports.getSimpleStoryWithPrefixAndSuffixInSourceTemplate = function() {
  return {
    metadata: {
      componentName: 'title',
      props: [{ name: 'text', value: 'hello world' }],
      children: [],
      sourceTemplate: '<div>__DSM_INJECTED_SOURCE__</div>'
    },
    expected: `<div><title text="hello world"></title></div>
`
  };
};

exports.getSimpleKnobsStory = function() {
  return {
    metadata: {
      componentName: 'my-div',
      props: [{ name: 'bgColor', knobLabel: 'div-color', value: 'blue' }],
      children: [{ value: 'div content' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    },
    knobs: { 'div-color': { value: 'red' } },
    expected: `<my-div bgColor="red">div content</my-div>
`
  };
};

exports.getStoryWithKnobSetAsDefaultValue = function() {
  return {
    metadata: {
      componentName: 'my-div',
      props: [{ name: 'bgColor', knobLabel: 'div-color', value: 'blue' }],
      children: [{ value: 'div content' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    },
    propsInfo: {
      bgColor: {
        type: {
          name: 'string'
        },
        defaultValue: {
          value: '"blue"'
        }
      }
    },
    knobs: { 'div-color': { value: 'blue' } },
    expected: `<my-div>div content</my-div>
`
  };
};

exports.getStoryWithValueSetAsFalsyValueWhenNoDefaultValueExplicitlyDefined = function() {
  return {
    metadata: {
      componentName: 'my-div',
      props: [{ name: 'bgColor', knobLabel: 'div-color', value: 'blue' }, { name: 'disabled', value: false }],
      children: [{ value: 'div content' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    },
    knobs: { 'div-color': { value: 'blue' } },
    expected: `<my-div bgColor="blue">div content</my-div>
`
  };
};

exports.getSpecialPropsStory = function() {
  return {
    metadata: {
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
    },
    knobs: { title: { value: 'Shalom' } },
    expected: `<my-button
  v-on:click="action"
  @scroll="action2"
  prefix="Shalom"
  normalProp="123"
  v-slot:mySlot
></my-button>
`
  };
};

exports.getStoryWithObjectProp = function() {
  return {
    metadata: {
      componentName: 'my-nav',
      props: [{ name: 'tabs', knobLabel: 'tabs', value: { num: 1, string: 'two' } }],
      children: [],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    },
    expected: `<my-nav tabs="{'num':1,'string':'two'}"></my-nav>
`
  };
};

exports.getStoryWithArrayOfObjectsProp = function() {
  return {
    metadata: {
      componentName: 'my-nav',
      props: [{ name: 'tabs', knobLabel: 'tabs', value: [{ num: 1, string: 'one' }, { num: 2, string: 'two' }] }],
      children: [],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    },
    propsInfo: {
      tabs: {
        type: {
          name: 'array'
        },
        defaultValue: {
          value: '[{ num: 1, string: "one" }]'
        }
      }
    },
    expected: `<my-nav tabs="[{'num':1,'string':'one'},{'num':2,'string':'two'}]"></my-nav>
`
  };
};

exports.getStoryWithArrayOfObjectsPropWithDefaultValue = function() {
  return {
    metadata: {
      componentName: 'my-nav',
      props: [{ name: 'tabs', knobLabel: 'tabs', value: [{ num: 1, string: 'one' }] }],
      children: [],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    },
    propsInfo: {
      tabs: {
        type: {
          name: 'array'
        },
        defaultValue: {
          value: '[{ num: 1, string: "one" }]'
        }
      }
    },
    expected: `<my-nav></my-nav>
`
  };
};

exports.getStoryWithArrayOfNumbersProp = function() {
  return {
    metadata: {
      componentName: 'my-nav',
      props: [{ name: 'tabs', knobLabel: 'tabs', value: [1, 2] }],
      children: [],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    },
    expected: `<my-nav tabs="[1,2]"></my-nav>
`
  };
};

exports.getStoryWithArrayOfNumbersPropWithDefaultValue = function() {
  return {
    metadata: {
      componentName: 'my-nav',
      props: [{ name: 'tabs', knobLabel: 'tabs', value: [1, 2] }],
      children: [],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    },
    propsInfo: {
      tabs: {
        type: {
          name: 'array'
        },
        defaultValue: {
          value: '[1, 2]'
        }
      }
    },
    expected: `<my-nav></my-nav>
`
  };
};

exports.getStoryWithArrayOfStringsProp = function() {
  return {
    metadata: {
      componentName: 'my-nav',
      props: [{ name: 'tabs', knobLabel: 'tabs', value: ['one 1', 'two 2'] }],
      children: [],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    },
    expected: `<my-nav tabs="['one 1','two 2']"></my-nav>
`
  };
};

exports.getStoryWithArrayOfStringsPropWithDefaultValue = function() {
  return {
    metadata: {
      componentName: 'my-nav',
      props: [{ name: 'tabs', knobLabel: 'tabs', value: ['one 1', 'two 2'] }],
      children: [],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    },
    propsInfo: {
      tabs: {
        type: {
          name: 'array'
        },
        defaultValue: {
          value: '["one 1","two 2"]'
        }
      }
    },
    expected: `<my-nav></my-nav>
`
  };
};
