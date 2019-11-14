const storiesOfAnalyzer = require('./analyzers/stories-of-analyzer');
const csfAnalyzer = require('./analyzers/csf-analyzer');

const fileAnalyzers = [storiesOfAnalyzer, csfAnalyzer];
const EMPTY_RESULT = {};

/**
 * Analyzer analyzes each file, going over all the stories in the file and handles all data extractions that should
 * happen on the client, preparing the metadata to be sent to server - where it will be further analyzed (for example,
 * extracting sample code based on the return statement we prepare here)
 * As a rule of thumb, we prefer to do as most analysis work as we can on the server,
 * for easier code changes and maintenance.
 */
module.exports = function(ast, storyFileSource, storyFilePath, framework) {
  let dsmStoriesDataResults = [];
  let importDeclarationsResults = [];
  for (const analyzer of fileAnalyzers) {
    const { importDeclarations, dsmStoriesData } = analyzer.analyze(ast, storyFileSource, storyFilePath, framework);

    if (dsmStoriesData.length) {
      importDeclarationsResults = importDeclarations;
      dsmStoriesDataResults = dsmStoriesData;
      break;
    }
  }

  if (dsmStoriesDataResults.length) {
    return { importDeclarations: importDeclarationsResults, stories: dsmStoriesDataResults };
  }

  return EMPTY_RESULT;
};
