import React from 'react';
import PropTypes from 'prop-types';
import FailedItemList from './FailedItemList';

const LightIncicatorScreen = ({ state, items, children }) => (
  <div className={`indicator-screen ${state}`}>
    {children}
    {state == 'fail' ? <FailedItemList items={items} /> : null}
  </div>
);

LightIncicatorScreen.propTypes = {
  state: PropTypes.string,
  items: PropTypes.array,
  children: PropTypes.node,
};

export default LightIncicatorScreen;
