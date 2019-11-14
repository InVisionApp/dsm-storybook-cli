exports.getSimpleStory = function() {
  return {
    metadata: {
      componentName: 'MyDiv',
      props: [{ name: 'bgColor', value: 'blue' }],
      children: [{ value: 'div content' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    },
    expected: `<MyDiv bgColor="blue">div content</MyDiv>;
`
  };
};

exports.getSimpleStoryWithoutChildren = function() {
  return {
    metadata: {
      componentName: 'Title',
      props: [{ name: 'text', value: 'hello world' }],
      children: [],
      sourceTemplate: '__DSM_INJECTED_SOURCE__;'
    },
    expected: `<Title text="hello world" />;
`
  };
};

exports.getSimpleStoryWithExpressionsInProp = function() {
  return {
    metadata: {
      componentName: 'MyDiv',
      props: [
        { name: 'bgColor', value: 'color', isExpression: true },
        { name: 'txtColor', value: 'getColor(3)', isExpression: true }
      ],
      children: [{ value: 'div content' }],
      sourceTemplate: '\n       __DSM_INJECTED_SOURCE__;\n    '
    },
    expected: `<MyDiv bgColor={color} txtColor={getColor(3)}>
  div content
</MyDiv>;
`
  };
};

exports.getSimpleStoryWithAnonymousFunctionsInProp = function() {
  return {
    metadata: {
      componentName: 'MyDiv',
      props: [
        { name: 'bgColor', value: '()=>"blue"', isExpression: true },
        { name: 'txtColor', value: 'function() {return "yellow";}', isExpression: true }
      ],
      children: [{ value: 'div content' }],
      sourceTemplate: '\n       __DSM_INJECTED_SOURCE__;\n    '
    },
    expected: `<MyDiv
  bgColor={() => "blue"}
  txtColor={function() {
    return "yellow";
  }}
>
  div content
</MyDiv>;
`
  };
};

exports.getComplexStory = function() {
  return {
    metadata: {
      componentName: 'MyDiv',
      props: [{ name: 'bgColor', value: 'blue' }],
      children: [{ value: '\n              ' }, { value: '<Title text="hello world" />' }, { value: '\n          ' }],
      sourceTemplate: '\n      <div>\n         __DSM_INJECTED_SOURCE__\n      </div>;\n    '
    },
    expected: `<div>
  <MyDiv bgColor="blue">
    <Title text="hello world" />
  </MyDiv>
</div>;
`
  };
};

exports.getSimpleKnobsStory = function() {
  return {
    metadata: {
      componentName: 'MyDiv',
      props: [{ name: 'bgColor', knobLabel: 'div-color', value: 'blue' }],
      children: [{ value: 'div content' }],
      sourceTemplate: '\n       __DSM_INJECTED_SOURCE__;\n    '
    },
    knobs: { 'div-color': { value: 'red' } },
    expected: `<MyDiv bgColor="red">div content</MyDiv>;
`
  };
};

exports.getSimpleKnobsStoryWithDestructuring = function() {
  return {
    metadata: {
      componentName: 'MyDiv',
      props: [{ value: '{...props}' }, { name: 'bgColor', knobLabel: 'div-color', value: 'blue' }],
      children: [{ value: 'div content' }],
      sourceTemplate: '\n       __DSM_INJECTED_SOURCE__;\n    '
    },
    knobs: { 'div-color': { value: 'red' } },
    expected: `<MyDiv {...props} bgColor="red">
  div content
</MyDiv>;
`
  };
};

exports.getStoryWithKnobSetAsDefaultValue = function() {
  return {
    metadata: {
      componentName: 'MyDiv',
      props: [
        { name: 'bgColor', knobLabel: 'div-color', value: 'blue' },
        { name: 'color', knobLabel: 'font-color', value: 'black' },
        { name: 'size', knobLabel: 'font-size', value: 10 },
        { name: 'width', knobLabel: 'width' }
      ],
      children: [{ value: 'div content' }],
      sourceTemplate: '\n       __DSM_INJECTED_SOURCE__;\n    '
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
          value: "'blue'" // Testing both types of quotes
        }
      },
      size: {
        type: {
          name: 'number'
        },
        defaultValue: {
          value: '12'
        }
      },
      width: {
        type: {
          name: 'number'
        },
        defaultValue: {
          value: 'null'
        }
      }
    },
    knobs: { 'div-color': { value: 'red' }, 'font-color': { value: 'blue' }, 'font-size': { value: 12 } },
    expected: `<MyDiv>div content</MyDiv>;
`
  };
};

exports.getStoryWithValueSetAsFalsyValueWhenNoDefaultValueExplicitlyDefined = function() {
  return {
    metadata: {
      componentName: 'MyDiv',
      props: [{ name: 'bgColor', value: 'blue' }, { name: 'disabled', value: false }],
      children: [{ value: 'div content' }],
      sourceTemplate: '\n       __DSM_INJECTED_SOURCE__;\n    '
    },
    expected: `<MyDiv bgColor="blue">div content</MyDiv>;
`
  };
};

exports.getStoryWithValueSetAsFalsyValueAndWithPrettierConfig = function() {
  return {
    metadata: {
      componentName: 'MyDiv',
      props: [{ name: 'bgColor', value: 'blue' }, { name: 'disabled', value: false }],
      children: [{ value: 'div content' }],
      sourceTemplate: '\n       __DSM_INJECTED_SOURCE__;\n    ',
      prettierConfig: { jsxSingleQuote: true }
    },
    expected: `<MyDiv bgColor='blue'>div content</MyDiv>;
`
  };
};

exports.getSimpleKnobsStoryWithKnobsInChildren = function() {
  return {
    metadata: {
      componentName: 'MyDiv',
      props: [{ name: 'bgColor', knobLabel: 'div-color', value: 'blue' }],
      children: [{ knobLabel: 'div-content', value: 'div content' }],
      sourceTemplate: '\n       __DSM_INJECTED_SOURCE__;\n    '
    },
    expected: `<MyDiv bgColor="__DSM_div-color__">__DSM_div-content__</MyDiv>;
`
  };
};

exports.getComplexKnobsStoryWithComponentConfig = function() {
  return {
    metadata: {
      componentName: 'MyDiv',
      props: [{ name: 'bgColor', knobLabel: 'div-color', value: 'blue' }],
      children: [
        { value: '\n            ' },
        { value: '<Title text={text("label", "hello world")} />' },
        { value: '\n          ' }
      ],
      sourceTemplate: '\n      <Paragraph>\n         __DSM_INJECTED_SOURCE__    \n      </Paragraph>;\n    '
    },
    knobs: { 'div-color': { value: 'red' } },
    expected: `<Paragraph>
  <MyDiv bgColor="red">
    <Title text={text("label", "hello world")} />
  </MyDiv>
</Paragraph>;
`
  };
};

exports.getStoryWithObjectProp = function() {
  return {
    metadata: {
      componentName: 'Nav',
      props: [{ name: 'tabs', knobLabel: 'tabs', value: { num: 1, string: 'two' } }],
      children: [],
      sourceTemplate: '\n       __DSM_INJECTED_SOURCE__;\n    '
    },
    expected: `<Nav tabs={{ num: 1, string: "two" }} />;
`
  };
};

exports.getStoryWithArrayOfObjectsProp = function() {
  return {
    metadata: {
      componentName: 'Nav',
      props: [{ name: 'tabs', knobLabel: 'tabs', value: [{ num: 1, string: 'one' }, { num: 2, string: 'two' }] }],
      children: [],
      sourceTemplate: '\n       __DSM_INJECTED_SOURCE__;\n    '
    },
    propsInfo: {
      tabs: {
        type: {
          name: 'arrayOf'
        },
        defaultValue: {
          value: '[{ num: 1, string: "one"}]'
        }
      }
    },
    expected: `<Nav tabs={[{ num: 1, string: "one" }, { num: 2, string: "two" }]} />;
`
  };
};

exports.getStoryWithArrayOfObjectsPropWithDefaultValue = function() {
  return {
    metadata: {
      componentName: 'Nav',
      props: [{ name: 'tabs', knobLabel: 'tabs', value: [{ num: 1, string: 'one' }] }],
      children: [],
      sourceTemplate: '\n       __DSM_INJECTED_SOURCE__;\n    '
    },
    propsInfo: {
      tabs: {
        type: {
          name: 'arrayOf'
        },
        defaultValue: {
          value: '[{ num: 1, string: "one"}]'
        }
      }
    },
    expected: `<Nav />;
`
  };
};

exports.getStoryWithArrayOfNumbersProp = function() {
  return {
    metadata: {
      componentName: 'Nav',
      props: [{ name: 'tabs', knobLabel: 'tabs', value: [1, 2] }],
      children: [],
      sourceTemplate: '\n       __DSM_INJECTED_SOURCE__;\n    '
    },
    expected: `<Nav tabs={[1, 2]} />;
`
  };
};

exports.getStoryWithArrayOfNumbersPropWithDefaultValue = function() {
  return {
    metadata: {
      componentName: 'Nav',
      props: [{ name: 'tabs', knobLabel: 'tabs', value: [1, 2] }],
      children: [],
      sourceTemplate: '\n       __DSM_INJECTED_SOURCE__;\n    '
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
    expected: `<Nav />;
`
  };
};

exports.getStoryWithArrayOfStringsProp = function() {
  return {
    metadata: {
      componentName: 'Nav',
      props: [{ name: 'tabs', knobLabel: 'tabs', value: ['one 1', 'two 2'] }],
      children: [],
      sourceTemplate: '\n       __DSM_INJECTED_SOURCE__;\n    '
    },
    expected: `<Nav tabs={["one 1", "two 2"]} />;
`
  };
};

exports.getStoryWithArrayOfStringsPropWithDefaultValue = function() {
  return {
    metadata: {
      componentName: 'Nav',
      props: [{ name: 'tabs', knobLabel: 'tabs', value: ['one 1', 'two 2'] }],
      children: [],
      sourceTemplate: '\n       __DSM_INJECTED_SOURCE__;\n    '
    },
    propsInfo: {
      tabs: {
        type: {
          name: 'array'
        },
        defaultValue: {
          value: '["one 1", "two 2"]'
        }
      }
    },
    expected: `<Nav />;
`
  };
};

exports.getStoryWithValueSetAsTrueWhenNoDefaultValueExplicitlyDefined = function() {
  return {
    metadata: {
      componentName: 'MyDiv',
      props: [{ name: 'disabled', value: true }],
      children: [{ value: 'div content' }],
      sourceTemplate: '\n       __DSM_INJECTED_SOURCE__;\n    '
    },
    expected: `<MyDiv disabled>div content</MyDiv>;
`
  };
};

exports.getSimpleKnobsStoryReactFragment = function() {
  return {
    metadata: {
      componentName: 'MyDiv',
      props: [{ name: 'bgColor', knobLabel: 'div-color', value: 'blue' }],
      children: [{ value: 'div content' }],
      sourceTemplate: '\n        <React.Fragment>\n          __DSM_INJECTED_SOURCE__\n        </React.Fragment>;\n    '
    },
    knobs: { 'div-color': { value: 'red' } },
    expected: `<React.Fragment>
  <MyDiv bgColor="red">div content</MyDiv>
</React.Fragment>;
`
  };
};

exports.getSimpleKnobsStoryFragment = function() {
  return {
    metadata: {
      componentName: 'MyDiv',
      props: [{ name: 'bgColor', knobLabel: 'div-color', value: 'blue' }],
      children: [{ value: 'div content' }],
      sourceTemplate: '\n        <Fragment>\n          __DSM_INJECTED_SOURCE__\n        </Fragment>;\n    '
    },
    knobs: { 'div-color': { value: 'red' } },
    expected: `<Fragment>
  <MyDiv bgColor="red">div content</MyDiv>
</Fragment>;
`
  };
};

exports.getSimpleKnobsStoryFragmentTags = function() {
  return {
    metadata: {
      componentName: 'MyDiv',
      props: [{ name: 'bgColor', knobLabel: 'div-color', value: 'blue' }],
      children: [{ value: 'div content' }],
      sourceTemplate: '\n        <>\n          __DSM_INJECTED_SOURCE__\n        </>;\n    '
    },
    knobs: { 'div-color': { value: 'red' } },
    expected: `<>
  <MyDiv bgColor="red">div content</MyDiv>
</>;
`
  };
};
