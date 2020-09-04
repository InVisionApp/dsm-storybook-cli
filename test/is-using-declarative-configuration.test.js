const { configurationFileNames, isUsingDeclarativeConfiguration } = require('../src/cli/is-using-declarative-configuration');

describe('Check which Storybook configuration version is being used', () => {
  const path = '/some/arbitrary/path';

  it('Checks legacy configuration in JS', () => {
    const isDeclarativeConfiguration = isUsingDeclarativeConfiguration(`${path}/${configurationFileNames.CONFIG}.js`);
    expect(isDeclarativeConfiguration).toBe(false);
  });

  it('Checks declarative configuration in JS', () => {
    const isDeclarativeConfiguration = isUsingDeclarativeConfiguration(`${path}/${configurationFileNames.PREVIEW}.js`);
    expect(isDeclarativeConfiguration).toBe(true);
  });

  it('Checks legacy configuration in JSX', () => {
    const isDeclarativeConfiguration = isUsingDeclarativeConfiguration(`${path}/${configurationFileNames.CONFIG}.jsx`);
    expect(isDeclarativeConfiguration).toBe(false);
  });

  it('Checks declarative configuration in JSX', () => {
    const isDeclarativeConfiguration = isUsingDeclarativeConfiguration(`${path}/${configurationFileNames.PREVIEW}.jsx`);
    expect(isDeclarativeConfiguration).toBe(true);
  });

  it('Checks legacy configuration in TS', () => {
    const isDeclarativeConfiguration = isUsingDeclarativeConfiguration(`${path}/${configurationFileNames.CONFIG}.ts`);
    expect(isDeclarativeConfiguration).toBe(false);
  });

  it('Checks declarative configuration in TS', () => {
    const isDeclarativeConfiguration = isUsingDeclarativeConfiguration(`${path}/${configurationFileNames.PREVIEW}.ts`);
    expect(isDeclarativeConfiguration).toBe(true);
  });

  it('Checks legacy configuration in TSX', () => {
    const isDeclarativeConfiguration = isUsingDeclarativeConfiguration(`${path}/${configurationFileNames.CONFIG}.tsx`);
    expect(isDeclarativeConfiguration).toBe(false);
  });

  it('Checks declarative configuration in TSX', () => {
    const isDeclarativeConfiguration = isUsingDeclarativeConfiguration(`${path}/${configurationFileNames.PREVIEW}.tsx`);
    expect(isDeclarativeConfiguration).toBe(true);
  });
});
