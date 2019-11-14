import productionCss from '!!raw-loader!./production.css';
import localCss from '!!raw-loader!./local.css';
import { themeConstants } from '../../../theme-constants';

const productionOptions = {
  showNav: false,
  enableShortcuts: false,
  theme: {
    brandTitle: themeConstants.NAME,
    brandUrl: themeConstants.DSM_URL,
    colorPrimary: themeConstants.PRIMARY,
    colorSecondary: themeConstants.PRIMARY,
    appBg: themeConstants.BACKGROUND,
    appContentBg: themeConstants.BACKGROUND,
    appBorderColor: themeConstants.SECONDARY,
    appBorderRadius: themeConstants.BORDER_RADIUS,
    inputBg: themeConstants.INPUT_BACKGROUND,
    inputTextColor: themeConstants.PRIMARY,
    inputBorderRadius: themeConstants.BORDER_RADIUS
  }
};

const localOptions = {
  ...productionOptions,
  showNav: true,
  enableShortcuts: true
};

const options = {
  production: productionOptions,
  local: localOptions
};

const css = {
  production: productionCss,
  local: localCss
};

export { options, css };
