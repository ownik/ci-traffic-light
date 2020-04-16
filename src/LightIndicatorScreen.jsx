import React from 'react';
import PropTypes from 'prop-types';
import FailedItemList from './FailedItemList';

import './LightIndicatorScreen.css';

const LightIncicatorScreen = ({ state, colors, items, children }) => (
  <div
    className={`indicator-screen ${state}`}
    style={{ backgroundColor: colors[state] }}
  >
    {children}
    {state == 'fail' ? <FailedItemList items={items} /> : null}
  </div>
);

LightIncicatorScreen.propTypes = {
  state: PropTypes.string,
  colors: PropTypes.object,
  items: PropTypes.array,
  children: PropTypes.node,
};

LightIncicatorScreen.defaultProps = {
  state: 'fail',
  colors: { fail: 'red', success: 'green' },
  items: [{ displayName: '1' }, { displayName: '2' }, { displayName: '3' }],
  children: null,
};

export default LightIncicatorScreen;
