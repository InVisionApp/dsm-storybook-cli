import { parse } from './docgen-parser';

export function getDocgenInfo(componentFilePath) {
  return parse(componentFilePath);
}
