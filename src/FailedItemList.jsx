import React from 'react';
import PropTypes from 'prop-types';
import FailedItem from './FailedItem';

const FailedItemList = ({ items }) => (
  <ul>
    {items.map((item) => (
      <FailedItem {...item} key={item.displayName} />
    ))}
  </ul>
);

FailedItemList.propTypes = {
  items: PropTypes.array,
};

export default FailedItemList;
