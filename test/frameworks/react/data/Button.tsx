import React from 'react';
// @ts-ignore // we don't install TS-related dependencies in dsm-storybook
import { chevronRightIcon } from './icons';
// @ts-ignore
import SVGInline from 'react-svg-inline';

import './_button.scss';

type ButtonProps = {
  /**
   * Adds an icon to the button
   */
  icon: 'chevron-right' | 'another-icon';
  /**
   * The content of the Button
   * */
  children: React.ReactNode;
  /**
   * Disable state of the button
   */
  disabled: boolean;
  /**
   * The function to be called when the button is clicked
   */
  onClick: (e: React.MouseEvent) => void;
  anotherProp: 1 | 2 | 3;
};

/**
 * Button description
 * */
const Button = ({ onClick, icon, children, disabled = false, anotherProp = 2 }: ButtonProps) => {
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

export default Button;
