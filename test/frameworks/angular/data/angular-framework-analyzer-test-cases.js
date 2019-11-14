exports.getStoryWithArrowImplicitReturn = function() {
  return `
  add(
    'with text',
    () => ({
      component: { MyButton },
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
    'with static text (content) and prefix (prop)',
    () => {
      return {
        component: { MyButton },
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
    'with static text (content) and prefix (prop)',
    () => ({      
      props: { textKnob: text('title', 'Hello Button') },
      component: { MyButton },
      template: '<my-button prefix=">>">click me</my-button>'      
    }),
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  );`;
};

exports.getStoryWithPropsExplicitReturn = function() {
  return `add(
    'with static text (content) and prefix (prop)',
    () => {
      return {
        props: { textKnob: text('title', 'Hello Button') },
        component: { MyButton },
        template: '<my-button prefix=">>">click me</my-button>'
      };
    },
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  )`;
};

exports.getStoryWithFunctionExplicitReturn = function() {
  return `add(
    'with static text (content) and prefix (prop)',
    function() {
      return {
        component: { MyButton },
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
    'with static text (content) and prefix (prop)',
    () => {
    if (true) {
      return {
          component: { MyButton },
          template: '<my-button>hi</my-button>'
        };
    } else {
    }
      return {
        component: { MyButton },
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
    'with static text (content) and prefix (prop)',
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
    'with static text (content) and prefix (prop)',
    function() {
      return {
        component: { MyButton }
      };
    },
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  )`;
};

exports.getStoryReturningNonStringTemplate = function() {
  return `add(
    'with static text (content) and prefix (prop)',
    function() {
      return {
        component: { MyButton },
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
    'with static text (content) and prefix (prop)',
    () => {
      var x = 123;  
      {
        return {
          component: { MyButton },
          template: '<my-button prefix=">>">click me</my-button>'
        };
      }
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
      template: \`<my-button prefix=\${1}>\${someVar}</my-button>\`
    }),
    {
      'in-dsm': { id: '5c7fc3986a4cc1bef4d65ecf' }
    }
  )
  `;
};
