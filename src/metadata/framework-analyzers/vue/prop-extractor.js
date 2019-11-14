const vueDocs = require('vue-docgen-api');
const pick = require('lodash/pick');
const forOwn = require('lodash/forOwn');

/**
 * Attempt to extract prop definitions and add them as a "props" property on "dsmInfo"
 * */
function extract(componentFilePath) {
  if (!componentFilePath) {
    return;
  }
  const docgenInfo = vueDocs.parse(componentFilePath);
  return normalizeDocgenInfo(docgenInfo);
}

/**
 * Normalize VUE docgenInfo to our common structure (react-doc-gen)
 * */
function normalizeDocgenInfo(vueDocgenInfo) {
  const normalized = pick(vueDocgenInfo, ['displayName', 'description']);
  const props = {};

  // each key in the props object is the name of the prop
  forOwn(vueDocgenInfo.props, (value, key, obj) => {
    props[key] = pick(value, ['description', 'type', 'required']);
    if (obj[key].defaultValue) {
      props[key].defaultValue = {
        value: obj[key].defaultValue.func ? 'func' : obj[key].defaultValue.value
      };
    }
  });
  normalized.props = props;
  return normalized;
}

module.exports = {
  extract
};
