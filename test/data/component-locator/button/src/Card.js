import React from 'react';
import PropTypes from 'prop-types';
const Card = ({ elevated }) => <div className={elevated ? 'elevated' : ''} />;
Card.displayName = 'Card';

Card.propTypes = {
  /**
   * sets whether this card is elevated
   * */
  elevated: PropTypes.bool
};

export default Card;
