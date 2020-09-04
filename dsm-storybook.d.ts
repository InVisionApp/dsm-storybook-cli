interface DsmTheme {
  base: 'light' | 'dark';
  brandTitle: string;
  brandUrl: string;
  fontBase: string;
  fontMono: string;
  colorPrimary: string;
  colorSecondary: string;
  appBg: string;
  appContentBg: string;
  appBorderColor: string;
  appBorderRadius: number;
  inputBg: string;
  inputTextColor: string;
  inputBorderRadius: number;
}

interface DsmOptions {
  showNav: boolean;
  enableShortcuts: boolean;
  fullscreen: {
    showPanel: boolean;
  };
  normal: {
    showPanel: boolean;
  };
}

declare function initDsm(params: { addDecorator: Function; addParameters?: Function; callback: any }): void;
declare function getDsmOptions(dsmEnvironmentVariable: string): DsmOptions;
declare function getDsmTheme(dsmEnvironmentVariable: string): DsmTheme;

export { initDsm, getDsmOptions, getDsmTheme };
