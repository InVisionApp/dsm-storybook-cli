const getCustomArgs = (program) =>
  program.rawArgs.splice(getRelevantArgumentsStartIndex(program.rawArgs)).filter((arg, index, relevantArgs) => {
    // If the option is not a custom option, then we skip it
    if (program.options.find((option) => option.short === arg || option.long === arg)) {
      return false;
    }

    // If it's the value of the previous non-custom option then we skip it as well
    const prevArg = relevantArgs[index - 1];
    const prevOption = program.optionFor(prevArg);
    if (prevOption && program[prevOption.attributeName()] === arg) {
      return false;
    }

    return true;
  });

// Get the index of the first one that starts with '-'
const getRelevantArgumentsStartIndex = (rawArgs) => {
  const firstArgIndex = rawArgs.findIndex((arg) => arg.startsWith('-'));
  return firstArgIndex > 0 ? firstArgIndex : 0;
};

module.exports = {
  getCustomArgs
};
