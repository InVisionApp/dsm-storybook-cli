import { options, css } from './configuration-fallback';

const defaultOptions = (isProduction) => (isProduction ? options.production : options.local);

const defaultCss = (isProduction) => (isProduction ? css.production : css.local);

export { defaultOptions, defaultCss };
