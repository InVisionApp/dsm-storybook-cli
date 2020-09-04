import { options, css, theme as defaultTheme } from './configuration-fallback';

const defaultOptions = (isProduction) => (isProduction ? options.production : options.local);

const defaultCss = (isProduction) => (isProduction ? css.production : css.local);

export { defaultOptions, defaultCss, defaultTheme };
