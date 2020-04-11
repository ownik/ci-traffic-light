import React from 'react';
import PropTypes from 'prop-types';
import './TimerLabel.css';

const msInSec = 1000;
const secsInMinute = 60;
const secsInHour = secsInMinute * 60;
const secsInDay = secsInHour * 24;

function toDDHHMM(time, now) {
  const secs = (now - time) / msInSec;

  if (secs < 0) {
    throw new Error(`${time} passed past date`);
  }

  let days = Math.floor(secs / secsInDay);
  let hours = Math.floor((secs - days * secsInDay) / secsInHour);
  let minutes = Math.floor(
    (secs - days * secsInDay - hours * secsInHour) / secsInMinute
  );

  if (days == 1) {
    days = `${days} day `;
  } else if (days > 0) {
    days = `${days} days `;
  } else {
    days = '';
  }

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  return `${days}${hours}:${minutes}`;
}

const TimerLabel = ({ time, now, state }) => (
  <div className={`timer-label ${state}`}>{toDDHHMM(time, now)}</div>
);

TimerLabel.propTypes = {
  time: PropTypes.instanceOf(Date),
  now: PropTypes.instanceOf(Date),
  state: PropTypes.oneOf(['fail', 'success']),
};

TimerLabel.defaultProps = {
  time: new Date(Date.now()),
  now: new Date(Date.now()),
  state: 'fail',
};

export default TimerLabel;
