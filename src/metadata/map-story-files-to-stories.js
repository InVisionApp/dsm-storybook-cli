module.exports = function(storyFilesMetadata) {
  const stories = [];
  storyFilesMetadata.forEach((storybookFile) => {
    storybookFile.stories.forEach((storyData) => {
      stories.push({
        importDeclarations: [...storybookFile.importDeclarations],
        ...storyData
      });
    });
  });

  return stories;
};
