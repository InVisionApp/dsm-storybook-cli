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

exports.getSimpleStoryWithMultipleRootElementsInTemplate = function() {
  return {
    metadata: {
      componentName: 'title',
      props: [{ name: 'text', value: 'hello world' }],
      children: [],
      sourceTemplate: '<div></div><p>blah</p>__DSM_INJECTED_SOURCE__<div></div>'
    },
    expected: `<div></div>
<p>blah</p>
<title text="hello world"></title>
<div></div>
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

exports.getStoryWithDirectiveInProps = function() {
  return {
    metadata: {
      componentName: 'my-button',
      props: [{ name: 'primary' }, { name: 'tooltip', value: 'click me' }],
      children: [{ value: 'start' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    },
    expected: `<my-button primary tooltip="click me">start</my-button>
`
  };
};

exports.getStoryWithKnobSetAsDefaultValue = function() {
  return {
    metadata: {
      componentName: 'my-div',
      props: [
        { name: 'bgColor', knobLabel: 'div-color', value: 'blue' },
        { name: 'color', knobLabel: 'font-color', value: 'black' },
        { name: 'size', knobLabel: 'font-size', value: 10 }
      ],
      children: [{ value: 'div content' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    },
    propsInfo: {
      bgColor: {
        type: {
          name: 'string'
        },
        defaultValue: {
          value: '"red"'
        }
      },
      color: {
        type: {
          name: 'string'
        },
        defaultValue: {
          value: "'blue'"
        }
      },
      size: {
        type: {
          name: 'number'
        },
        defaultValue: {
          value: '12'
        }
      }
    },
    knobs: { 'div-color': { value: 'red' }, 'font-color': { value: 'blue' }, 'font-size': { value: 12 } },
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

exports.getStoryWithObjectProp = function() {
  return {
    metadata: {
      componentName: 'nav',
      props: [{ name: 'tabs', knobLabel: 'tabs', value: { num: 1, string: 'two' } }],
      children: [],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    },
    expected: `<nav tabs="{'num':1,'string':'two'}"></nav>
`
  };
};

exports.getStoryWithArrayOfObjectsProp = function() {
  return {
    metadata: {
      componentName: 'nav',
      props: [{ name: 'tabs', knobLabel: 'tabs', value: [{ num: 1, string: 'one' }, { num: 2, string: 'two' }] }],
      children: [],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    },
    propsInfo: {
      tabs: {
        type: {
          name: 'Array<object>'
        },
        defaultValue: {
          value: '[{ num: 1, string: "one"}]'
        }
      }
    },
    expected: `<nav tabs="[{'num':1,'string':'one'},{'num':2,'string':'two'}]"></nav>
`
  };
};

exports.getStoryWithArrayOfNumbersProp = function() {
  return {
    metadata: {
      componentName: 'nav',
      props: [{ name: 'tabs', knobLabel: 'tabs', value: [1, 2] }],
      children: [],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    },
    expected: `<nav tabs="[1,2]"></nav>
`
  };
};

exports.getStoryWithArrayOfStringsProp = function() {
  return {
    metadata: {
      componentName: 'nav',
      props: [{ name: 'tabs', knobLabel: 'tabs', value: ['one 1', 'two 2'] }],
      children: [],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    },
    expected: `<nav tabs="['one 1','two 2']"></nav>
`
  };
};
