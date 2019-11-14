import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ primary }) => <div className={primary ? 'primary' : ''} />;

Button.displayName = 'Button';

Button.propTypes = {
  primary: PropTypes.bool
};

export default Button;
