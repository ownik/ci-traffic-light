import React from 'react';
import PropTypes from 'prop-types';
import FailedItem from './FailedItem';

import './FailedItemList.css';

const FailedItemList = ({ items }) => (
  <div className="failed-item-list">
    <ul>
      {items.map((item) => (
        <FailedItem {...item} key={item.displayName} />
      ))}
    </ul>
  </div>
);

FailedItemList.propTypes = {
  items: PropTypes.array,
};

FailedItemList.defaultProps = {
  items: [],
};

export default FailedItemList;
