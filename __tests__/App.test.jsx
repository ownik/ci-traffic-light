import React from 'react';
import { shallow } from 'enzyme';
import App from '../src/App';

import TimerLabel from '../src/TimerLabel';

describe('App', () => {
  test('renders without crashing', () => {
    shallow(<App />);
  });

  test('first element must be div', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.first().type()).toBe('div');
  });

  test('first element default color is red', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.get(0).props.style).toHaveProperty('backgroundColor', 'red');
  });

  test('renders single <TimerLabel /> component', () => {
    const wrapper = shallow(<App />);
    const timerLabel = wrapper.find(TimerLabel);
    expect(timerLabel).toHaveLength(1);

    /// expect(timerLabel.props()).toHaveProperty('time', new Date());
  });
});
