const fs = require('fs');
const iFrameHtmlFilename = 'iframe.html';

function getBaseUrl(host, organizationName, buildId) {
  return `https://${host}/dsm-api/storybook/${organizationName}/${buildId}/asset-proxy?assetName=`;
}

function transformAssetUrls(assetFiles, config) {
  const baseUrl = getBaseUrl(config.dsmHost, config.organization, config.buildId);

  assetFiles.forEach((file) => {
    if (shouldTransformFile(file.fileName)) {
      transformFile(file, assetFiles, baseUrl);
    }
  });
}

const STYLE_EXTENSIONS = /.css$/;
function shouldTransformFile(fileName) {
  return /.bundle.js$/.test(fileName) || /.html$/.test(fileName) || STYLE_EXTENSIONS.test(fileName);
}

/**
 * Replace the url of dependencies so that they are proxied through DSM.
 * This gives us more flexibility as to where to host storybook
 * */
function transformFile(file, assetFiles, baseUrl) {
  let src = fs.readFileSync(file.resolvedPath, 'utf8');
  let sourceChanged = false;

  assetFiles.forEach((asset) => {
    if (shouldTransformAsset(src, file, asset)) {
      sourceChanged = true;
      if (asset.fileName === iFrameHtmlFilename) {
        const regExp = RegExp(`"${iFrameHtmlFilename}`, 'g');
        src = src.replace(regExp, `"${baseUrl}${iFrameHtmlFilename}`);
      } else {
        src = replaceBySourceFile(src, file.fileName, asset, baseUrl);
      }
    }
  });

  if (sourceChanged) {
    fs.writeFileSync(file.resolvedPath, src, 'utf8');
  }
}

function replaceBySourceFile(src, sourceFile, asset, baseUrl) {
  const fileRegexPattern = `\\.?\\/?${asset.fileName}`;
  const fileReplaceValue = `${baseUrl}${asset.fileName}`;

  // catch "url(<FileName>)" in CSS & in <style> tags inside JS files. the url() can be wrapped with ' \ " or nothing
  // url(fonts/MyFont.woff) / url('fonts/MyFont.woff') / url("fonts/MyFont.woff")
  const urlRegex = `(url\\(\\\\?(?:'|")?)(${fileRegexPattern})(\\\\?(?:'|")?\\))`;
  let alteredSrc = src.replace(RegExp(urlRegex, 'gi'), `$1${fileReplaceValue}$3`);

  if (STYLE_EXTENSIONS.test(sourceFile)) {
    return alteredSrc;
  }

  // Replace either "assetFileName" or "/assetFileName" (for files that are located in a nested folder)
  return alteredSrc.replace(RegExp(`"${fileRegexPattern}"`, 'gi'), `"${fileReplaceValue}"`);
}

function shouldTransformAsset(src, file, asset) {
  return !isSelfReference(file.fileName, asset.fileName) && isAssetFoundInFile(src, asset);
}

/**
 * string.indexOf() is much cheaper than replace, use it to make sure we have a match before we do a replace
 * and avoid expensive regex compilations+searches and replaces
 * */
function isAssetFoundInFile(src, asset) {
  return src.indexOf(asset.fileName) > -1;
}

/**
 * A file will never have a reference to itself
 * */
function isSelfReference(fileName1, fileName2) {
  return fileName1 === fileName2;
}

const transformModule = (module.exports = transformAssetUrls);

transformModule.replaceBySourceFile = replaceBySourceFile;
