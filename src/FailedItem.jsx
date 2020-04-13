import React from 'react';
import PropTypes from 'prop-types';

const FailedItem = ({ displayName }) => <li>{displayName}</li>;

FailedItem.propTypes = {
  displayName: PropTypes.string,
};

export default FailedItem;
