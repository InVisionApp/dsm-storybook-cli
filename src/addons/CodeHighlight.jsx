import React from 'react';
import PropTypes from 'prop-types';
import Highlight, { defaultProps } from 'prism-react-renderer';
import highlightTheme from 'prism-react-renderer/themes/nightOwlLight';
import './_code-highlighter.css';

const LineNumber = (props) => {
  const style = {
    width: `${props.width} em`
  };

  return (
    <span className="c-code-highlight__line-number" style={style}>
      {props.children}
    </span>
  );
};

LineNumber.propTypes = {
  width: PropTypes.number
};

export class CodeHighlight extends React.PureComponent {
  static propTypes = {
    language: PropTypes.string
  };

  render() {
    const { children, language } = this.props;

    return (
      <Highlight {...defaultProps} code={children.trim()} language={language} theme={highlightTheme}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} c-code-highlight__pre`} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {<LineNumber width={tokens.length.toString().length}>{i + 1}</LineNumber>}
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    );
  }
}

export default CodeHighlight;
