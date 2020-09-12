import React from 'react';
import PropTypes from 'prop-types';
import FailedItemList from './FailedItemList';

import './LightIndicatorScreen.css';

const LightIncicatorScreen = ({ status, colors, items, children }) => (
  <div
    className={`indicator-screen ${status}`}
    style={{ backgroundColor: colors[status] }}
  >
    {children}
    <FailedItemList items={items} />
  </div>
);

LightIncicatorScreen.propTypes = {
  status: PropTypes.string,
  colors: PropTypes.object,
  items: PropTypes.array,
  children: PropTypes.node,
};

LightIncicatorScreen.defaultProps = {
  status: 'fail',
  colors: { fail: 'red', success: 'green' },
  items: [],
  children: null,
};

export default LightIncicatorScreen;
