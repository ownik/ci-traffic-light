import React from 'react';
import PropTypes from 'prop-types';
import FailedItemList from './FailedItemList';

import './LightIndicatorScreen.css';

const LightIncicatorScreen = ({ status, items, children }) => (
  <div className={`indicator-screen ${status}`}>
    {children}
    <FailedItemList items={items} />
  </div>
);

LightIncicatorScreen.propTypes = {
  status: PropTypes.string,
  items: PropTypes.array,
  children: PropTypes.node,
};

LightIncicatorScreen.defaultProps = {
  status: 'idle',
  items: [],
  children: null,
};

export default LightIncicatorScreen;
