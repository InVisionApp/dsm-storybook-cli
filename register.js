const registerDsm = require('./dist/register').registerDsm;

// We need to handle different behaviors depending on whether
// the user is using the new or legacy configuration method
// in Storybook. dsm-storybook cli knows which method the user
// is using, so we pass it here via the STORYBOOK_DSM env var.
const DSM_CONFIG = JSON.parse(process.env.STORYBOOK_DSM);
const isUsingDeclarativeConfiguration = DSM_CONFIG.IS_USING_DECLARATIVE_CONFIGURATION;

// The new configuration method requires `register.js` to execute
// its own registration steps, rather than exporting a function
// for the user to call.
// https://storybook.js.org/docs/addons/using-addons/
if (isUsingDeclarativeConfiguration) {
  registerDsm(process.env.STORYBOOK_DSM);
}

// We export `registerDsm` to maintain backwards compatibility for
// users currently using the "Legacy" configuration method.
exports.registerDsm = registerDsm;
