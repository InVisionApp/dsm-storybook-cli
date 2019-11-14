const fs = require('fs');
const glob = require('glob');
const parseFile = require('./parser');
const analyzeFile = require('./analyzer');
const logger = require('../cli/cli-logger');
const userMessages = require('../user-messages');
const isEmpty = require('lodash/isEmpty');

const DEFAULT_STORIES_SOURCE_PATH = 'src/stories/**/*.js';

function getStorySourceFiles(pathGlob) {
  const paths = glob.sync(pathGlob);
  if (!paths.length) {
    logger.error(userMessages.noStoryFilesMatchingSearchPattern(pathGlob));
  }
  return paths;
}

function getSource(path) {
  try {
    return fs.readFileSync(path, 'utf8');
  } catch (e) {
    logger.error(userMessages.failedToReadStorySourceFile(path), e, { storyFilePath: path });

    return null;
  }
}

function getAst(src, path) {
  if (!src) {
    return null;
  }
  try {
    return parseFile(src);
  } catch (e) {
    const message = userMessages.failedToParseStorySourceFile(path);
    logger.error(message, e, { storyFilePath: path, storySourceCode: src });
    return null;
  }
}

function analyze(ast, src, path, framework) {
  if (!ast || !src) {
    return null;
  }
  try {
    return analyzeFile(ast, src, path, framework);
  } catch (e) {
    logger.error(userMessages.failedToAnalyzeFile(path), e, { storyFilePath: path, storySourceCode: src });
    return null;
  }
}

function extractMetadataFromStories(storySourcePaths, framework) {
  return storySourcePaths.reduce((acc, path) => {
    logger.info(userMessages.analyzingFile(path));

    const src = getSource(path);
    const ast = getAst(src, path);
    const metadata = analyze(ast, src, path, framework);

    return isEmpty(metadata) ? acc : acc.concat(metadata);
  }, []);
}

function collect(options) {
  const storySourcePaths = getStorySourceFiles(options.storyPath || DEFAULT_STORIES_SOURCE_PATH);
  return extractMetadataFromStories(storySourcePaths, options.storybookFramework);
}

module.exports = {
  collect
};
