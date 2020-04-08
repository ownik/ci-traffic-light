import React from 'react';
import PropTypes from 'prop-types';

const msInSec = 1000;
const secsInMinute = 60;
const secsInHour = secsInMinute * 60;
const secsInDay = secsInHour * 24;

function toDDHHMM(time) {
  const secs = (time - Date.now()) / msInSec;

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

const TimerLabel = ({ time }) => <div>{toDDHHMM(time)}</div>;

TimerLabel.propTypes = {
  time: PropTypes.instanceOf(Date),
};

export default TimerLabel;
