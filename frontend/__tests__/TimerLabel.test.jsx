import React from 'react';
import { shallow } from 'enzyme';
import TimerLabel from '../src/TimerLabel';

describe('TimerLabel', () => {
  const time = new Date(2020, 4, 8, 20, 10, 30).getTime();
  let consoleErrorMock;

  beforeEach(() => {
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  test('renders without crashing', () => {
    shallow(<TimerLabel />);
  });

  test('first element must be div', () => {
    const wrapper = shallow(<TimerLabel />);
    expect(wrapper.type()).toBe('div');
  });

  test('default has class timer-label and fail', () => {
    const wrapper = shallow(<TimerLabel />);
    expect(wrapper.hasClass('timer-label')).toEqual(true);
    expect(wrapper.hasClass('fail')).toEqual(true);
  });

  test('set status to success', () => {
    const wrapper = shallow(<TimerLabel status="success" />);
    expect(wrapper.hasClass('timer-label')).toEqual(true);
    expect(wrapper.hasClass('success')).toEqual(true);
  });

  test('set unknown status throw error', () => {
    shallow(<TimerLabel status="unknow-status" />);
    expect(consoleErrorMock).toHaveBeenCalledTimes(1);
  });

  test('now date display 00:00:00', () => {
    const wrapper = shallow(<TimerLabel now={time} time={time} />);
    expect(wrapper.text()).toEqual('00:00:00');
  });

  test('2020-04-08 20:11:30 display 00:0100', () => {
    const wrapper = shallow(
      <TimerLabel
        time={time}
        now={new Date(2020, 4, 8, 20, 11, 30).getTime()}
      />
    );
    expect(wrapper.text()).toEqual('00:01:00');
  });

  test('2020-04-08 21:11:30 display 01:01:00', () => {
    const wrapper = shallow(
      <TimerLabel
        time={time}
        now={new Date(2020, 4, 8, 21, 11, 30).getTime()}
      />
    );
    expect(wrapper.text()).toEqual('01:01:00');
  });

  test('2020-04-09 21:11:40 display 1 day 01:01:10', () => {
    const wrapper = shallow(
      <TimerLabel
        time={time}
        now={new Date(2020, 4, 9, 21, 11, 40).getTime()}
      />
    );
    expect(wrapper.text()).toEqual('1 day 01:01:10');
  });

  test('2020-04-10 21:11:30 display 2 days 01:01:00', () => {
    const wrapper = shallow(
      <TimerLabel
        time={time}
        now={new Date(2020, 4, 10, 21, 11, 30).getTime()}
      />
    );
    expect(wrapper.text()).toEqual('2 days 01:01:00');
  });

  test('2020-05-10 21:11:30 display 33 days 01:01:00', () => {
    const wrapper = shallow(
      <TimerLabel
        time={time}
        now={new Date(2020, 5, 10, 21, 11, 30).getTime()}
      />
    );
    expect(wrapper.text()).toEqual('33 days 01:01:00');
  });

  test('2021-05-11 9:21:30 display 398 days 13:11:00', () => {
    const wrapper = shallow(
      <TimerLabel
        time={time}
        now={new Date(2021, 5, 11, 9, 21, 30).getTime()}
      />
    );
    expect(wrapper.text()).toEqual('398 days 13:11:00');
  });

  test('now past date 2019-05-10 21:11:30 throw error', () => {
    expect(() =>
      shallow(
        <TimerLabel
          time={time}
          now={new Date(2019, 5, 10, 21, 11, 30).getTime()}
        />
      )
    ).toThrow(`${time} passed past date`);
  });
});
