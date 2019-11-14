import React from 'react';
import PropTypes from 'prop-types';
import { chevronRightIcon } from './icons';
import SVGInline from 'react-svg-inline';

import './_button.scss';

/**
 * Button description
 * */
const Button = ({ onClick, icon, disabled, children }) => {
  return (
    <button
      onClick={!disabled && onClick}
      className={`c-button ${icon && 'c-button__with-icon'} ${disabled && 'c-button__disabled'}`}
    >
      <div className="c-button__content">{children}</div>
      {icon && (
        <div className="c-button__icon">
          <SVGInline svg={chevronRightIcon} />
        </div>
      )}
    </button>
  );
};

Button.propTypes = {
  /**
   * Adds an icon to the button
   */
  icon: PropTypes.oneOf(['chevron-right', 'another-icon']),
  /**
   * The content of the Button
   * */
  children: PropTypes.node,
  /**
   * Disable state of the button
   * */
  disabled: PropTypes.bool,
  /**
   * The function to be called when the button is clicked
   */
  onClick: PropTypes.func,
  anotherProp: PropTypes.oneOf([1, 2, 3])
};

Button.defaultProps = {
  disabled: false,
  anotherProp: 2
};

export default Button;
