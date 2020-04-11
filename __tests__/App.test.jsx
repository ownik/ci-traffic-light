import React from 'react';
import { shallow, mount } from 'enzyme';
import App from '../src/App';

import TimerLabel from '../src/TimerLabel';

describe('App', () => {
  jest
    .spyOn(Date, 'now')
    .mockImplementation(() => new Date(2020, 4, 8, 20, 10, 30));

  test('renders without crashing', () => {
    shallow(<App />);
  });

  test('first element must be div', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.type()).toBe('div');
  });

  test('first element default color is red', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.get(0).props.style).toHaveProperty('backgroundColor', 'red');
  });

  test('renders single <TimerLabel /> component with mocked now time', () => {
    const wrapper = mount(<App />);
    const timerLabel = wrapper.find(TimerLabel);
    expect(timerLabel).toHaveLength(1);

    expect(timerLabel.props()).toHaveProperty(
      'time',
      new Date(2020, 4, 8, 20, 10, 30)
    );

    expect(timerLabel.text()).toEqual('00:00');
  });

  test('test timer', () => {
    jest.useFakeTimers();

    const wrapper = mount(<App />);
    const timerLabel = wrapper.find(TimerLabel);

    expect(timerLabel).toHaveLength(1);
    expect(timerLabel.text()).toEqual('00:00');

    Date.now = jest.fn(() => new Date(2020, 4, 8, 20, 11, 30));

    const spy = jest.spyOn(wrapper.instance(), 'timerEvent');

    jest.advanceTimersByTime(1000);

    expect(timerLabel.text()).toEqual('00:01');

    Date.now = jest.fn(() => new Date(2020, 4, 8, 21, 12, 30));

    jest.clearAllMocks();
    jest.advanceTimersByTime(5000);

    expect(spy).toHaveBeenCalledTimes(5);
    expect(timerLabel.text()).toEqual('01:02');

    jest.useRealTimers();
  });
});
