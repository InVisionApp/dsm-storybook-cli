exports.getSimpleStory = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyDiv',
      name: 'simple usage, no knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: { returnStatement: `<MyDiv bgColor="blue">div content</MyDiv>` },
      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'color', 'text'] },
        { moduleName: 'react', bindings: ['React'] }
      ]
    },
    expected: {
      componentName: 'MyDiv',
      props: [{ name: 'bgColor', value: 'blue' }],
      children: [{ value: 'div content' }],
      sourceTemplate: '__DSM_INJECTED_SOURCE__'
    }
  };
};

exports.getSimpleStoryWithoutChildren = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'Title',
      name: 'simple usage, no knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: { returnStatement: `<Title text="hello world" />;` },
      importDeclarations: []
    },
    expected: {
      componentName: 'Title',
      props: [{ name: 'text', value: 'hello world' }],
      children: [],
      sourceTemplate: '__DSM_INJECTED_SOURCE__;'
    }
  };
};

exports.getSimpleStoryWithExpressionsInProp = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyDiv',
      name: 'simple usage, no knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        returnStatement: `
        <MyDiv bgColor={color} txtColor={getColor(3)}>div content</MyDiv>;
    `
      },
      importDeclarations: [{ moduleName: 'react', bindings: ['React'] }]
    },
    expected: {
      componentName: 'MyDiv',
      props: [
        { name: 'bgColor', value: 'color', isExpression: true },
        { name: 'txtColor', value: 'getColor(3)', isExpression: true }
      ],
      children: [{ value: 'div content' }],
      sourceTemplate: '\n        __DSM_INJECTED_SOURCE__;\n    '
    }
  };
};

exports.getSimpleStoryWithAnonymousFunctionsInProp = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyDiv',
      name: 'simple usage, no knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        returnStatement: `
        <MyDiv bgColor={()=>"blue"} txtColor={function() {return "yellow";}}>div content</MyDiv>;
    `
      },
      importDeclarations: [{ moduleName: 'react', bindings: ['React'] }]
    },
    expected: {
      componentName: 'MyDiv',
      props: [
        { name: 'bgColor', value: '()=>"blue"', isExpression: true },
        { name: 'txtColor', value: 'function() {return "yellow";}', isExpression: true }
      ],
      children: [{ value: 'div content' }],
      sourceTemplate: '\n        __DSM_INJECTED_SOURCE__;\n    '
    }
  };
};

exports.getComplexStory = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyDiv',
      name: 'complex usage, no knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        returnStatement: `
      <div>
          <MyDiv bgColor="blue">
              <Title text="hello world" />
          </MyDiv>
      </div>;
    `
      },
      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'color', 'text'] },
        { moduleName: 'react', bindings: ['React'] }
      ]
    },
    expected: {
      componentName: 'MyDiv',
      props: [{ name: 'bgColor', value: 'blue' }],
      children: [{ value: '\n              ' }, { value: '<Title text="hello world" />' }, { value: '\n          ' }],
      sourceTemplate: '\n      <div>\n          __DSM_INJECTED_SOURCE__\n      </div>;\n    '
    }
  };
};

exports.getSimpleKnobsStory = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyDiv',
      name: 'with knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        returnStatement: `
        <MyDiv bgColor={color("div-color", "blue")} fontColor={select("font-color", options, "red")}>div content</MyDiv>;
    `
      },

      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'color', 'text', 'select'] },
        { moduleName: 'react', bindings: ['React'] }
      ]
    },
    expected: {
      componentName: 'MyDiv',
      props: [
        { name: 'bgColor', knobLabel: 'div-color', value: 'blue' },
        { name: 'fontColor', knobLabel: 'font-color', value: 'red' }
      ],
      children: [{ value: 'div content' }],
      sourceTemplate: '\n        __DSM_INJECTED_SOURCE__;\n    '
    }
  };
};

exports.getSimpleKnobsStoryWithDestructuring = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyDiv',
      name: 'with knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        returnStatement: `
        <MyDiv {...props} bgColor={color("div-color", "blue")} fontColor={select("font-color", options, "red")}>div content</MyDiv>;
    `
      },

      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'color', 'text', 'select'] },
        { moduleName: 'react', bindings: ['React'] }
      ]
    },
    expected: {
      componentName: 'MyDiv',
      props: [
        { value: '{...props}', isExpression: true },
        { name: 'bgColor', knobLabel: 'div-color', value: 'blue' },
        { name: 'fontColor', knobLabel: 'font-color', value: 'red' }
      ],
      children: [{ value: 'div content' }],
      sourceTemplate: '\n        __DSM_INJECTED_SOURCE__;\n    '
    }
  };
};

exports.getSimpleKnobsStoryWithKnobsInChildren = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyDiv',
      name: 'with knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        returnStatement: `
        <MyDiv bgColor={color("div-color", "blue")}>{text("div-content","div content")}</MyDiv>;
    `
      },
      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'color', 'text'] },
        { moduleName: 'react', bindings: ['React'] }
      ]
    },
    expected: {
      componentName: 'MyDiv',
      props: [{ name: 'bgColor', knobLabel: 'div-color', value: 'blue' }],
      children: [{ knobLabel: 'div-content', value: 'div content' }],
      sourceTemplate: '\n        __DSM_INJECTED_SOURCE__;\n    '
    }
  };
};

exports.getSimpleKnobsStoryWithDefaultValues = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyDiv',
      name: 'with knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        returnStatement: `
        <MyDiv bgColor={color("div-color")}>div content</MyDiv>;
    `
      },
      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'color', 'text'] },
        { moduleName: 'react', bindings: ['React'] }
      ]
    },
    expected: {
      componentName: 'MyDiv',
      props: [{ name: 'bgColor', knobLabel: 'div-color' }],
      children: [{ value: 'div content' }],
      sourceTemplate: '\n        __DSM_INJECTED_SOURCE__;\n    '
    }
  };
};

exports.getStoryWithWrongComponentElementDefined = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyDiv',
      name: 'with knobs',
      dsmInfo: { id: 'ac3545', component: 'BreakingBad' },
      frameworkMetadata: {
        returnStatement: `
        <MyDiv bgColor={color("div-color")}>div content</MyDiv>;
    `
      },
      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'color', 'text'] },
        { moduleName: 'react', bindings: ['React'] }
      ]
    },
    expected: null
  };
};

exports.getComplexKnobsStoryWithComponentConfig = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyDiv',
      name: 'complex with knobs',
      dsmInfo: { id: 'ac3545', component: 'MyDiv' },
      frameworkMetadata: {
        returnStatement: `
      <Paragraph>
          <MyDiv bgColor={color("div-color", "blue")}>
            <Title text={text("label", "hello world")} />
            <Title text={text("label", "hello world2")} />
          </MyDiv>    
      </Paragraph>;
    `
      },
      importDeclarations: [{ moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'color', 'text'] }]
    },
    expected: {
      componentName: 'MyDiv',
      props: [{ name: 'bgColor', knobLabel: 'div-color', value: 'blue' }],
      children: [
        {
          value: '\n            '
        },
        {
          value: '<Title text={text("label", "hello world")} />'
        },
        {
          value: '\n            '
        },
        {
          value: '<Title text={text("label", "hello world2")} />'
        },
        {
          value: '\n          '
        }
      ],
      sourceTemplate: '\n      <Paragraph>\n          __DSM_INJECTED_SOURCE__    \n      </Paragraph>;\n    '
    }
  };
};

exports.getSimpleKnobsStoryReactFragment = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyDiv',
      name: 'with knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        returnStatement: `
        <React.Fragment>
          <MyDiv bgColor={color("div-color", "blue")} fontColor={select("font-color", options, "red")}>div content</MyDiv>
        </React.Fragment>;
    `
      },

      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'color', 'text', 'select'] },
        { moduleName: 'react', bindings: ['React'] }
      ]
    },
    expected: {
      componentName: 'MyDiv',
      props: [
        { name: 'bgColor', knobLabel: 'div-color', value: 'blue' },
        { name: 'fontColor', knobLabel: 'font-color', value: 'red' }
      ],
      children: [{ value: 'div content' }],
      sourceTemplate: '\n        <React.Fragment>\n          __DSM_INJECTED_SOURCE__\n        </React.Fragment>;\n    '
    }
  };
};

exports.getSimpleKnobsStoryFragment = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyDiv',
      name: 'with knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        returnStatement: `
        <Fragment>
          <MyDiv bgColor={color("div-color", "blue")} fontColor={select("font-color", options, "red")}>div content</MyDiv>
        </Fragment>;
    `
      },

      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'color', 'text', 'select'] },
        { moduleName: 'react', bindings: ['React'] }
      ]
    },
    expected: {
      componentName: 'MyDiv',
      props: [
        { name: 'bgColor', knobLabel: 'div-color', value: 'blue' },
        { name: 'fontColor', knobLabel: 'font-color', value: 'red' }
      ],
      children: [{ value: 'div content' }],
      sourceTemplate: '\n        <Fragment>\n          __DSM_INJECTED_SOURCE__\n        </Fragment>;\n    '
    }
  };
};

exports.getSimpleKnobsStoryReactFragmentTags = function() {
  return {
    metadata: {
      externalComponentId: 'ac3545',
      kind: 'MyDiv',
      name: 'with knobs',
      dsmInfo: { id: 'ac3545' },
      frameworkMetadata: {
        returnStatement: `
        <>
          <MyDiv bgColor={color("div-color", "blue")} fontColor={select("font-color", options, "red")}>div content</MyDiv>
        </>;
    `
      },

      importDeclarations: [
        { moduleName: '@storybook/addon-knobs', bindings: ['withKnobs', 'color', 'text', 'select'] },
        { moduleName: 'react', bindings: ['React'] }
      ]
    },
    expected: {
      componentName: 'MyDiv',
      props: [
        { name: 'bgColor', knobLabel: 'div-color', value: 'blue' },
        { name: 'fontColor', knobLabel: 'font-color', value: 'red' }
      ],
      children: [{ value: 'div content' }],
      sourceTemplate: '\n        <>\n          __DSM_INJECTED_SOURCE__\n        </>;\n    '
    }
  };
};
