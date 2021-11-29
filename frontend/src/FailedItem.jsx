import React from 'react';
import PropTypes from 'prop-types';
import ProgressSpinner from './ProgressSpinner';

const FailedItem = ({ displayName, running }) => (
  <li>
    <span>{displayName}</span>
    {running && <ProgressSpinner />}
  </li>
);

FailedItem.propTypes = {
  displayName: PropTypes.string,
  running: PropTypes.bool,
};

export default FailedItem;
