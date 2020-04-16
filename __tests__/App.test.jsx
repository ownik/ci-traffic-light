import React from 'react';
import { shallow, mount } from 'enzyme';
import App from '../src/App';

import LightIndicatorScreen from '../src/LightIndicatorScreen';
import TimerLabel from '../src/TimerLabel';

describe('App', () => {
  describe('Basic App tests', () => {
    test('renders without crashing', () => {
      shallow(<App />);
    });

    test('expected first element is LightIndicatorScreen', () => {
      const wrapper = shallow(<App />);
      expect(wrapper.type()).toBe(LightIndicatorScreen);
    });
  });

  describe('TimerLabel integration', () => {
    let wrapper;
    let timerLabel;
    let timerEventMock;
    let nowDate = new Date(2020, 4, 8, 20, 10, 30);
    let mockDateNow;

    beforeAll(() => {
      jest.useFakeTimers();
      mockDateNow = jest
        .spyOn(Date, 'now')
        .mockImplementation(() => nowDate.getTime());
      wrapper = mount(<App />);
      timerLabel = wrapper.find(TimerLabel);
    });

    afterAll(() => {
      timerEventMock.mockRestore();
      mockDateNow.mockRestore();
      jest.useRealTimers();
    });

    beforeEach(() => {
      timerEventMock = jest.spyOn(wrapper.instance(), 'timerEvent');
    });

    afterEach(() => {
      timerEventMock.mockClear();
    });

    test('exist single TimerLabel', () => {
      expect(timerLabel).toHaveLength(1);
    });

    test('TimerLabel text is 00:00', () => {
      expect(timerLabel.text()).toEqual('00:00');
    });

    test('TimerLabel text is nowDate', () => {
      expect(timerLabel.props()).toHaveProperty('time', nowDate);
    });

    test('advance timers by 1000ms with nowDate changing cause update of TimerLabel text', () => {
      nowDate = new Date(2020, 4, 8, 21, 12, 30);
      jest.advanceTimersByTime(1000);
      expect(timerLabel.text()).toEqual('01:02');
    });

    test('advance timers by 5000ms cause calling timerEvent 5 times', () => {
      jest.advanceTimersByTime(5000);
      expect(timerEventMock).toHaveBeenCalledTimes(5);
    });
  });
});
