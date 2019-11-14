const fs = require('fs-extra');
const parseAngularDoc = require('angular-docgen').default;
const isNill = require('lodash/isNil');

/**
 * Attempt to extract prop definitions and add them as a "props" property on "dsmInfo"
 * */
function extract(componentFilePath) {
  if (!componentFilePath) {
    return;
  }

  const src = fs.readFileSync(componentFilePath, 'utf8');
  const docgenInfo = parseAngularDoc(src);
  return normalizeDocgenInfo(docgenInfo);
}

/**
 * Normalize Angular docgenInfo (example: https://github.com/thatguynamedandy/angular-docgen) to our common structure (react-doc-gen)
 * no option to mark a property (@Input) as required in angular
 * */
function normalizeDocgenInfo(angularDocgenInfo) {
  const componentData = angularDocgenInfo.component;
  if (!componentData) {
    return null;
  }

  const normalizedInfo = {
    description: componentData.description,
    displayName: componentData.name,
    selector: componentData.selector
  };
  const props = {};

  if (angularDocgenInfo.inputs) {
    angularDocgenInfo.inputs.forEach((input) => {
      const propName = input.name;
      const prop = {};
      prop.description = input.description;
      prop.type = {
        name: input.type
      };

      // we don't support explicit null OR undefined as default values because we
      // can't differentiate between these and not setting a default value
      if (!isNill(input.value)) {
        prop.defaultValue = {
          value: getPropValue(input.type, input.value)
        };
      }

      if (input.options) {
        prop.type.name = 'enum';
        prop.type.value = input.options.map((option) => {
          return { value: getPropValue(input.type, option) };
        });
      }
      props[propName] = prop;
    });
  }

  normalizedInfo.props = props;
  return normalizedInfo;
}

function getPropValue(type, value) {
  const normalizedValue = String(value);
  return type === 'string' ? `'${normalizedValue}'` : normalizedValue;
}

module.exports = {
  extract
};
