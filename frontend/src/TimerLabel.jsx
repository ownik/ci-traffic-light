import React from 'react';
import PropTypes from 'prop-types';
import './TimerLabel.css';

const msInSec = 1000;
const secsInMinute = 60;
const secsInHour = secsInMinute * 60;
const secsInDay = secsInHour * 24;

function toDDHHMM(time, now, separator) {
  const secs = (now - time) / msInSec;

  if (secs < 0) {
    throw new Error(`${time} passed past date`);
  }

  let days = Math.floor(secs / secsInDay);
  let hours = Math.floor((secs - days * secsInDay) / secsInHour);
  let minutes = Math.floor(
    (secs - days * secsInDay - hours * secsInHour) / secsInMinute
  );
  let seconds = Math.floor(
    secs - days * secsInDay - hours * secsInHour - minutes * secsInMinute
  );

  if (days == 1) {
    days = `${days} day `;
  } else if (days > 1) {
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
  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  return `${days}${hours}${separator}${minutes}${separator}${seconds}`;
}

const TimerLabel = ({ time, now, status, separator }) => (
  <div className={`timer-label ${status}`}>
    {toDDHHMM(time, now, separator)}
  </div>
);

TimerLabel.propTypes = {
  time: PropTypes.number,
  now: PropTypes.number,
  status: PropTypes.oneOf(['fail', 'success']),
  separator: PropTypes.string,
};

TimerLabel.defaultProps = {
  time: Date.now(),
  now: Date.now(),
  status: 'fail',
  separator: ':',
};

export default TimerLabel;
