/**
 * https://github.com/storybooks/storybook/blob/v5.1.9/lib/router/src/utils.ts
 * @param param - the string to sanitize
 * @returns string - the sanitized string
 */
const sanitize = (param) => {
  return (
    param
      .toLowerCase()
      // eslint-disable-next-line no-useless-escape
      .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  );
};

const translateId = (id) => {
  const params = id.split('--');
  const kind = params[0];
  const name = params[1];

  return { kind, name };
};

module.exports = { sanitize, translateId };
