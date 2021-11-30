import React from 'react';
import PropTypes from 'prop-types';
import ProgressSpinner from './ProgressSpinner';

const FailedItem = ({ displayName, href, running }) => (
  <li>
    <span>
      {!href || href === '' ? displayName : <a href={href}>{displayName}</a>}
    </span>
    {running && <ProgressSpinner />}
  </li>
);

FailedItem.propTypes = {
  displayName: PropTypes.string,
  href: PropTypes.string,
  running: PropTypes.bool,
};

FailedItem.defaultProps = {
  href: '',
};

export default FailedItem;
