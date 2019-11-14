exports.getStoryWithArrowExplicitReturn = function() {
  return `add('default svg color', () => {
      return <Icon glyph="type-symbol" />;
    }, { 'in-dsm': { id: 'abc1', n: { nid: 6 } } });`;
};

exports.getStoryWithArrowImplicitReturn = function() {
  return `add('default svg color', () => <Icon glyph="type-symbol" />, { 'in-dsm': { id: 'abc1', n: { nid: 6 } } });`;
};

exports.getStoryWithFunctionReturn = function() {
  return `add('default svg color', function() { return <Icon glyph="type-symbol" /> }, { 'in-dsm': { id: 'abc1', n: { nid: 6 } } });`;
};

exports.getStoryWithMultipleReturn = function() {
  return `add('default svg color', function() { if(true) {return <Icon glyph="type-symbol" />} else { return <Icon glyph="type-symbol" /> } }, { 'in-dsm': { id: 'abc1', n: { nid: 6 } } });`;
};

exports.getStoryWithNestedReturn = function() {
  return `add('default svg color', function() {var x = 10; {return <Icon glyph="type-symbol" />}} , { 'in-dsm': { id: 'abc1', n: { nid: 6 } } });`;
};

exports.getStoryWithDestructuring = function() {
  return `add('default',
        () => <Task {...actions} />,
        { 'in-dsm': { id: '5caf493dd68f41018fa018b9' } }
      );`;
};

exports.getStoryWithReactFragment = function() {
  return `add('default',
        () => <React.Fragment><Task /></React.Fragment>,
        { 'in-dsm': { id: '5caf493dd68f41018fa018b9' } }
      );`;
};

exports.getStoryWithFragment = function() {
  return `add('default',
        () => <Fragment><Task /></Fragment>,
        { 'in-dsm': { id: '5caf493dd68f41018fa018b9' } }
      );`;
};

exports.getStoryWithFragmentTags = function() {
  return `add('default',
        () => <><Task /></>,
        { 'in-dsm': { id: '5caf493dd68f41018fa018b9' } }
      );`;
};
