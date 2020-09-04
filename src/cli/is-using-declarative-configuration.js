import path from 'path';

export const configurationFileNames = {
  CONFIG: 'config',
  PREVIEW: 'preview'
};

export const isUsingDeclarativeConfiguration = (filePath) => {
  if (!filePath) {
    return false;
  }

  const fileName = path
    .basename(filePath) // get filename with extension from path (ex: preview.js)
    .split('.') // create array from string delimited by "."
    .shift(); // get the first element of the array, which is the filename (ex: preview)

  return fileName === configurationFileNames.PREVIEW;
};
