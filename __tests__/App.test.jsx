import React from 'react';
import { shallow, mount } from 'enzyme';
import mockAxios from 'axios';
import App from '../src/App';
import { Teamcity } from '../src/Teamcity';

import LightIndicatorScreen from '../src/LightIndicatorScreen';
import TimerLabel from '../src/TimerLabel';

jest.mock('axios', () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve({ data: {} })),
}));

jest.mock('../src/Teamcity');
Teamcity.prototype.checkState.mockResolvedValue([]);

describe('App', () => {
  beforeEach(() => {
    Teamcity.mockClear();
    Teamcity.prototype.checkState.mockClear();
  });

  describe('Basic App tests', () => {
    test('expected first element is LightIndicatorScreen', () => {
      const wrapper = shallow(<App />);
      expect(wrapper.type()).toBe(LightIndicatorScreen);
    });
  });

  describe('Settings read', () => {
    let fetchSettingsMock;
    let updateStateMock;
    let app;

    beforeEach(() => {
      jest.useFakeTimers();
      mockAxios.get.mockClear();
      fetchSettingsMock = jest.spyOn(App.prototype, 'fetchSettings');
      updateStateMock = jest.spyOn(App.prototype, 'updateState');
    });

    afterEach(() => {
      if (app) app.unmount();
      fetchSettingsMock.mockRestore();
      updateStateMock.mockRestore();
      jest.useRealTimers();
    });

    test('should call fetchSettings, connect, setInterval and updateState during componentDidMount \
    and call clearInterval in componentWillUnmount', (done) => {
      const mockSettings = {
        serverUrl: 'http://localhost:8080',
        auth: { user: 'root', password: '123456' },
        branch: 'default',
        buildTypes: ['Build Type 1', 'Build Type 2', 'Build Type 3'],
      };

      Teamcity.prototype.checkState.mockResolvedValueOnce(['Build Type 1']);
      fetchSettingsMock = fetchSettingsMock.mockResolvedValueOnce({
        data: mockSettings,
      });

      app = shallow(<App />);

      setImmediate(() => {
        expect(fetchSettingsMock).toHaveBeenCalledTimes(1);
        expect(app.instance().teamcity).toBeInstanceOf(Teamcity);
        expect(updateStateMock).toHaveBeenCalledTimes(1);
        expect(Teamcity).toHaveBeenCalledTimes(1);
        expect(Teamcity).toHaveBeenCalledWith(
          mockSettings.serverUrl,
          mockSettings.auth,
          mockSettings.branch
        );
        expect(Teamcity.prototype.checkState).toHaveBeenCalledTimes(1);
        expect(Teamcity.prototype.checkState).toHaveBeenCalledWith(
          mockSettings.buildTypes
        );
        expect(app.state()).toHaveProperty('checkStateResult', [
          'Build Type 1',
        ]);
        expect(setInterval).toHaveBeenCalledTimes(1);
        app.unmount();
        expect(clearInterval).toHaveBeenCalledTimes(1);
        done();
      });
    });

    test('check updateState interval 5000ms', (done) => {
      const settings = { updateStateInterval: 5000 };

      fetchSettingsMock = fetchSettingsMock.mockResolvedValue({
        data: settings,
      });

      app = shallow(<App />);

      setImmediate(() => {
        expect(updateStateMock).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(1000);
        expect(updateStateMock).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(5000);
        expect(updateStateMock).toHaveBeenCalledTimes(2);
        jest.advanceTimersByTime(50000);
        expect(updateStateMock).toHaveBeenCalledTimes(12);
        done();
      });
    });

    test('check updateState interval 30000ms', (done) => {
      const settings = { updateStateInterval: 30000 };

      fetchSettingsMock = fetchSettingsMock.mockResolvedValue({
        data: settings,
      });

      app = shallow(<App />);

      setImmediate(() => {
        expect(updateStateMock).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(1000);
        expect(updateStateMock).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(5000);
        expect(updateStateMock).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(50000);
        expect(updateStateMock).toHaveBeenCalledTimes(2);
        done();
      });
    });

    test('read settings in componentDidMount', (done) => {
      const settings = { test: true, string: 'some string' };

      fetchSettingsMock = fetchSettingsMock.mockResolvedValue({
        data: settings,
      });
      const wrapper = shallow(<App />);

      setImmediate(() => {
        expect(wrapper.instance().settings).toEqual(settings);
        done();
      });
    });

    test('manualy call fetch settings with mocked axios', async () => {
      const settings = { test: true, string: 'some string' };

      mockAxios.get.mockImplementationOnce(() => Promise.resolve(settings));

      const wrapper = shallow(<App />, { disableLifecycleMethods: true });

      await expect(wrapper.instance().fetchSettings()).resolves.toEqual(
        settings
      );

      expect(mockAxios.get).toHaveBeenCalledTimes(1);

      expect(mockAxios.get).toHaveBeenCalledWith('/settings.json');
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
      wrapper.unmount();
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
