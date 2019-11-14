exports.getStoryWithArrowImplicitReturn = function() {
  return `
  add(
    'with text',
    () => ({
      components: { MyButton },
      template: '<my-button prefix=">>">click me</my-button>'
    }),
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  )
  `;
};

exports.getStoryWithArrowExplicitReturn = function() {
  return `add(
    'with static text (slot) and prefix (prop)',
    () => {
      return {
        components: { MyButton },
        template: '<my-button prefix=">>">click me</my-button>'
      };
    },
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  )`;
};

exports.getStoryWithPropsImplicitReturn = function() {
  return `add(
    'with static text (slot) and prefix (prop)',
    () => ({      
      props: { textKnob: { default: text('title', 'Hello Button') } },
      components: { MyButton },
      template: '<my-button prefix=">>">click me</my-button>'      
    }),
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  );`;
};

exports.getStoryWithPropsExplicitReturn = function() {
  return `add(
    'with static text (slot) and prefix (prop)',
    () => {
      return {
        props: { textKnob: { default: text('title', 'Hello Button') } },
        components: { MyButton },
        template: '<my-button prefix=">>">click me</my-button>'
      };
    },
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  )`;
};

exports.getStoryWithPropsAsArray = function() {
  return `add(
    'with static text (slot) and prefix (prop)',
    () => ({      
      props: ['propA', 'propB'],
      components: { MyButton },
      template: '<my-button prefix=">>">click me</my-button>'      
    }),
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  );`;
};

exports.getStoryWithFunctionExplicitReturn = function() {
  return `add(
    'with static text (slot) and prefix (prop)',
    function() {
      return {
        components: { MyButton },
        template: '<my-button prefix=">>">click me</my-button>'
      };
    },
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  )`;
};

exports.getStoryWithMultipleReturnStatements = function() {
  return `add(
    'with static text (slot) and prefix (prop)',
    () => {
    if (true) {
      return {
          components: { MyButton },
          template: '<my-button>hi</my-button>'
        };
    } else {
    }
      return {
        components: { MyButton },
        template: '<my-button prefix=">>">click me</my-button>'
      };
    },
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  )`;
};

exports.getStoryReturningString = function() {
  return `add(
    'with static text (slot) and prefix (prop)',
    function() {
      return 'test';
    },
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  )`;
};

exports.getStoryReturningObjectMissingTemplate = function() {
  return `add(
    'with static text (slot) and prefix (prop)',
    function() {
      return {
        components: { MyButton }
      };
    },
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  )`;
};

exports.getStoryReturningNonStringTemplate = function() {
  return `add(
    'with static text (slot) and prefix (prop)',
    function() {
      return {
        components: { MyButton },
        template: <div>123</div>
      };
    },
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  )`;
};

exports.getStoryWithNestedReturn = function() {
  return `add(
    'with static text (slot) and prefix (prop)',
    () => {
      var x = 123;  
      {
        return {
          components: { MyButton },
          template: '<my-button prefix=">>">click me</my-button>'
        };
      }
    },
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  )`;
};

exports.getStoryWithRenderInsteadOfTemplate = function() {
  return `add(
    'with static text (slot) and prefix (prop)',
    () => {
      return {
        components: { MyButton },
        render: (createElement) => {
          return createElement(
            'my-button',
            {
              props: {
                prefix: '>> '
              }
            },
            [createElement('span', 'text')]
          );
         }
      };
    },
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  )`;
};

exports.getStoryWithTemplateLiteralInTemplate = function() {
  return `
  add(
    'with template literal',
    () => ({
      components: { MyButton },
      template: \`<my-button id=\${1} prefix=">>">\${'hey!'} click me</my-button>\`
    }),
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  )
  `;
};

exports.getStoryWithDataFunction = function() {
  return `
  add(
    'with data function',
    () => ({
      components: { MyButton },
      template: \`<my-button id=\${tempId} prefix=">>">\${'hey!'} click me</my-button>\`,
      data: function() {
      return { tempId: 1 }
      }
    }),
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  )
  `;
};

exports.getStoryWithArrowDataFunctionWithReturn = function() {
  return `
  add(
    'with data arrow function with return',
    () => {
     return ({
       components: { MyButton },
       template: \`<my-button id=\${tempId} prefix=">>">\${'hey!'} click me</my-button>\`,
       data: () => {
       return { tempId: 1 }
       }
     });
    },
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  )
  `;
};

exports.getStoryWithArrowDataFunctionWithAutoReturn = function() {
  return `
  add(
    'with data arrow function with auto return syntax',
    () => {
    return ({
      components: { MyButton },
      template: \`<my-button id=\${tempId} prefix=">>">\${'hey!'} click me</my-button>\`,
      data: () => ({ tempId: 1 })
     });
    },
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  )
  `;
};

exports.getStoryWithArrowDataFunctionWithReturnAndExtraReturnInBody = function() {
  return `
  add(
    'with data arrow function with return',
    () => {
     if(false){
      return '<my-button>return value</my-button>'
      }
     
     return {
       components: { MyButton },
       template: \`<my-button id=\${tempId} prefix=">>">\${'hey!'} click me</my-button>\`,
       data: () => {
       return { tempId: 1 }
       }
     }
    },
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  )
  `;
};
