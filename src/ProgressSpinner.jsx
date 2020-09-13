import React from 'react';
import PropTypes from 'prop-types';

const ProgressSpinner = ({ visible }) => (
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
