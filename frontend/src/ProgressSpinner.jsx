import React from 'react';
import PropTypes from 'prop-types';

import './ProgressSpinner.css';

const ProgressSpinner = () => (
  <div className="lds-roller">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

ProgressSpinner.propTypes = {
  visible: PropTypes.bool,
};

ProgressSpinner.defaultProps = {
  visible: false,
};

export default ProgressSpinner;
