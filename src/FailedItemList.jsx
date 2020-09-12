import React from 'react';
import PropTypes from 'prop-types';
import FailedItem from './FailedItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './FailedItemList.css';

const FailedItemList = ({ items }) => (
  <div className="failed-item-list">
    <TransitionGroup component="ul">
      {items.map((item) => (
        <CSSTransition timeout={1000} key={item.displayName}>
          <FailedItem {...item} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  </div>
);

FailedItemList.propTypes = {
  items: PropTypes.array,
  visible: PropTypes.bool,
};

FailedItemList.defaultProps = {
  items: [],
  visible: false,
};

export default FailedItemList;
