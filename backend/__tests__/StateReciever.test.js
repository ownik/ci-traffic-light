const StateReciever = require('../src/StateReciever');
const SettingsStorage = require('../src/SettingsStorage');
const { Teamcity } = require('../src/Teamcity');

jest.mock('../src/Teamcity');
jest.mock('../src/SettingsStorage');

const setImmediatePromise = () => new Promise(setImmediate);

const lastChangedStatusTime = new Date(2020, 9, 20, 16, 55, 11).getTime();

const makeSettings = (timeout) => {
  return {
    serverUrl: 'http://localhost:8112',
    auth: { username: 'root', password: '12345' },
    branch: 'stable',
    buildTypes: ['Build 1', 'Build 2', 'Build 3'],
    updateStateInterval: timeout,
    lastChangedStatusTime,
  };
};

Teamcity.prototype.checkState.mockResolvedValue({
  items: [],
  status: 'success',
});

const updateStateSpy = jest.spyOn(StateReciever.prototype, 'updateState');

const settingsStorage = new SettingsStorage('settings.json');

describe('StateReciever', () => {
  let stateReciever;

  beforeEach(() => {
    jest.useFakeTimers('legacy');
    updateStateSpy.mockClear();
    Date.now = jest
      .fn()
      .mockReturnValue(new Date(2020, 9, 19, 16, 39, 50).getTime());
  });

  afterEach(() => {
    if (stateReciever) stateReciever.stop();
    stateReciever = null;
    settingsStorage.settings.mockClear();
    settingsStorage.updateLastChangedStatusTime.mockClear();
    Date.now.mockRestore();
    jest.useRealTimers();
  });

  test('calls Teamcity constructor in constructor', () => {
    expect(Teamcity).toHaveBeenCalledTimes(0);
    const settings = makeSettings(1000);
    settingsStorage.settings.mockReturnValue(settings);
    stateReciever = new StateReciever(settingsStorage);
    expect(Teamcity).toHaveBeenCalledTimes(1);
    expect(Teamcity).toHaveBeenCalledWith(settings);
    expect(stateReciever.settingsStorage()).toBe(settingsStorage);
  });

  test('setInterval 1000ms calls in constructor', async () => {
    expect(setInterval).toHaveBeenCalledTimes(0);
    settingsStorage.settings.mockReturnValue(makeSettings(1000));
    stateReciever = new StateReciever(settingsStorage);
    await setImmediatePromise();
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 1000);
  });

  test('setInterval 2000ms calls in constructor', async () => {
    expect(setInterval).toHaveBeenCalledTimes(0);
    settingsStorage.settings.mockReturnValue(makeSettings(2000));
    stateReciever = new StateReciever(settingsStorage);
    await setImmediatePromise();
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 2000);
  });

  test('clearInterval when reciever stopped', async () => {
    expect(clearInterval).toHaveBeenCalledTimes(0);
    settingsStorage.settings.mockReturnValue(makeSettings(2000));
    stateReciever = new StateReciever(settingsStorage);
    await setImmediatePromise();
    stateReciever.stop();
    stateReciever = null;
    expect(clearInterval).toHaveBeenCalledTimes(1);
  });

  test('2000ms timeout after 10000ms calls 5times updateState and checkState', async () => {
    Teamcity.prototype.checkState.mockClear();
    updateStateSpy.mockClear();
    settingsStorage.settings.mockReturnValue(makeSettings(2000));
    stateReciever = new StateReciever(settingsStorage);
    await setImmediatePromise();
    expect(updateStateSpy).toHaveBeenCalledTimes(1);
    expect(Teamcity.prototype.checkState).toHaveBeenCalledTimes(1);
    Teamcity.prototype.checkState.mockClear();
    updateStateSpy.mockClear();
    jest.advanceTimersByTime(10000);
    expect(updateStateSpy).toHaveBeenCalledTimes(5);
    expect(Teamcity.prototype.checkState).toHaveBeenCalledTimes(5);
  });

  test('check last state changed time', async () => {
    settingsStorage.settings.mockReturnValue(makeSettings(1000));
    stateReciever = new StateReciever(settingsStorage);
    await setImmediatePromise();

    expect(updateStateSpy).toHaveBeenCalledTimes(1);
    expect(stateReciever.state()).toStrictEqual({
      items: [],
      lastChangedStatusTime,
      status: 'success',
    });

    const state1 = { item: {}, status: 'success' };
    const nowTime1 = new Date(2020, 9, 19, 16, 39, 51).getTime();
    Date.now.mockReturnValueOnce(nowTime1);
    Teamcity.prototype.checkState.mockResolvedValue(state1);
    settingsStorage.settings.mockReturnValue({
      lastChangedStatusTime: nowTime1,
    });
    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    expect(stateReciever.state()).toStrictEqual({
      ...state1,
      lastChangedStatusTime: nowTime1,
    });

    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    expect(stateReciever.state()).toStrictEqual({
      ...state1,
      lastChangedStatusTime: nowTime1,
    });

    const state2 = { item: ['Build 1'], status: 'fail' };
    const nowTime2 = new Date(2020, 9, 20, 16, 55, 11).getTime();
    Date.now.mockReturnValueOnce(nowTime2);
    Teamcity.prototype.checkState.mockResolvedValue(state2);
    settingsStorage.settings.mockReturnValue({
      lastChangedStatusTime: nowTime2,
    });
    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    expect(stateReciever.state()).toStrictEqual({
      ...state2,
      lastChangedStatusTime: nowTime2,
    });
  });

  test('check update last state changed time', async () => {
    settingsStorage.settings.mockReturnValue(makeSettings(1000));
    stateReciever = new StateReciever(settingsStorage);
    await setImmediatePromise();

    expect(updateStateSpy).toHaveBeenCalledTimes(1);
    expect(settingsStorage.updateLastChangedStatusTime).toHaveBeenCalledTimes(
      1
    );

    updateStateSpy.mockClear();
    settingsStorage.updateLastChangedStatusTime.mockClear();

    const state1 = { item: {}, status: 'success' };
    const nowTime1 = new Date(2020, 9, 19, 16, 39, 51).getTime();
    Date.now.mockReturnValueOnce(nowTime1);
    Teamcity.prototype.checkState.mockResolvedValue(state1);
    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    expect(settingsStorage.updateLastChangedStatusTime).toHaveBeenCalledTimes(
      1
    );
    expect(settingsStorage.updateLastChangedStatusTime).toHaveBeenCalledWith(
      'success'
    );
    settingsStorage.updateLastChangedStatusTime.mockClear();

    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    expect(settingsStorage.updateLastChangedStatusTime).toHaveBeenCalledTimes(
      1
    );
    expect(settingsStorage.updateLastChangedStatusTime).toHaveBeenCalledWith(
      'success'
    );
    settingsStorage.updateLastChangedStatusTime.mockClear();

    const state2 = { item: ['Build 1'], status: 'fail' };
    const nowTime2 = new Date(2020, 9, 20, 16, 55, 11).getTime();
    Date.now.mockReturnValueOnce(nowTime2);
    Teamcity.prototype.checkState.mockResolvedValue(state2);
    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    expect(settingsStorage.updateLastChangedStatusTime).toHaveBeenCalledTimes(
      1
    );
    expect(settingsStorage.updateLastChangedStatusTime).toHaveBeenCalledWith(
      'fail'
    );
  });
});
