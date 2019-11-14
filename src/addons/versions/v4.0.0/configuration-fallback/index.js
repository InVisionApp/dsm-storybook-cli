import productionCss from '!!raw-loader!./production.css';
import localCss from '!!raw-loader!./local.css';
import { themeConstants } from '../../../theme-constants';

const productionOptions = {
  name: themeConstants.NAME,
  url: themeConstants.DSM_URL,
  showStoriesPanel: false,
  enableShortcuts: false,

  theme: {
    mainBorder: `1px solid ${themeConstants.SECONDARY}`,
    mainBorderRadius: themeConstants.BORDER_RADIUS,
    mainBackground: themeConstants.BACKGROUND,
    mainFill: themeConstants.BACKGROUND,
    barFill: themeConstants.BACKGROUND,
    barSelectedColor: themeConstants.PRIMARY,
    mainTextFace:
      '-apple-system,"San Francisco",BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue","Lucida Grande","Arial",sans-serif',
    mainTextColor: themeConstants.PRIMARY,
    dimmedTextColor: '#9599a2',
    inputFill: themeConstants.INPUT_BACKGROUND,
    successColor: themeConstants.SUCCESS,
    failColor: themeConstants.ERROR,
    warnColor: themeConstants.WARNING,
    mainTextSize: '13px',
    monoTextFace:
      '-apple-system,"San Francisco",BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue","Lucida Grande","Arial",sans-serif',
    layoutMargin: 0
  }
};

const localOptions = {
  ...productionOptions,
  showStoriesPanel: true,
  enableShortcuts: true,
  theme: {
    ...productionOptions.theme,
    layoutMargin: 10
  }
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
