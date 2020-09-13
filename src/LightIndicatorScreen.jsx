import React from 'react';
import PropTypes from 'prop-types';
import FailedItemList from './FailedItemList';

import './LightIndicatorScreen.css';

const LightIncicatorScreen = ({ status, styles, items, children }) => (
  <div className={`indicator-screen ${status}`} style={styles[status]}>
    {children}
    <FailedItemList items={items} />
  </div>
);

LightIncicatorScreen.propTypes = {
  status: PropTypes.string,
  styles: PropTypes.object,
  items: PropTypes.array,
  children: PropTypes.node,
};

LightIncicatorScreen.defaultProps = {
  status: 'fail',
  styles: {
    fail: {
      background: 'linear-gradient(#FF416C, #FF4B2B)',
    },
    investigation: {
      background: 'linear-gradient(#FFC11E, #FFD600)',
    },
    success: {
      background: 'linear-gradient(#11998E, #38EF7D)',
    },
  },
  items: [],
  children: null,
};

export default LightIncicatorScreen;
