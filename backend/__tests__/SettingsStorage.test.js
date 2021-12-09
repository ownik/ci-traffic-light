const SettingsStorage = require('../src/SettingsStorage');
const fs = require('fs');

jest.mock('fs');

const updateLastChangedStatusTimeSpy = jest.spyOn(
  SettingsStorage.prototype,
  'updateLastChangedStatusTime'
);

describe('Settings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Date.now = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
    Date.now.mockRestore();
  });

  test('fetchSettings simple 1 (no lastChangedStatusTime)', () => {
    const mockSettings = {
      serverUrl: 'http://localhost:8111',
      auth: { username: 'root', password: '123456' },
      branch: '(default:true)',
      buildTypes: ['CiIndicatorTest_Build1', 'CiIndicatorTest_Build2'],
      updateStateInterval: 10000,
    };
    Date.now.mockReturnValue(new Date(2020, 9, 19, 20, 13, 45).getTime());
    fs.readFileSync.mockReturnValue(JSON.stringify(mockSettings));
    expect(updateLastChangedStatusTimeSpy).toHaveBeenCalledTimes(0);
    const settingsStorage = new SettingsStorage('./settings.json');
    expect(updateLastChangedStatusTimeSpy).toHaveBeenCalledTimes(1);
    expect(updateLastChangedStatusTimeSpy).toHaveBeenCalledWith('');
    expect(updateLastChangedStatusTimeSpy).toHaveReturnedWith(true);
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync).toHaveBeenCalledWith('./settings.json');
    expect(settingsStorage.settings()).toEqual({
      ...mockSettings,
      lastChangedStatusTime: new Date(2020, 9, 19, 20, 13, 45).getTime(),
      lastStatus: '',
    });
  });

  test('fetchSettings simple 2', () => {
    const mockSettings = {
      serverUrl: 'http://localhost:8112',
      auth: { username: 'root', password: '12345' },
      branch: 'stable',
      buildTypes: ['Build 1', 'Build 2', 'Build 3'],
      updateStateInterval: 9999,
      lastChangedStatusTime: new Date(2020, 9, 20, 12, 45, 0).getTime(),
      lastStatus: 'success',
    };
    Date.now.mockReturnValue(new Date(1993, 5, 7, 2, 0, 0).getTime());
    fs.readFileSync.mockReturnValue(JSON.stringify(mockSettings, null, 2));
    expect(updateLastChangedStatusTimeSpy).toHaveBeenCalledTimes(0);
    expect(
      new SettingsStorage('/etc/config/settings-external.json').settings()
    ).toEqual(mockSettings);
    expect(updateLastChangedStatusTimeSpy).toHaveBeenCalledTimes(0);
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync).toHaveBeenCalledWith(
      '/etc/config/settings-external.json'
    );
  });

  test('updateLastChangedStatusTime created if not exist', () => {
    const mockSettings = {
      serverUrl: 'http://localhost:8112',
      auth: { username: 'root', password: '12345' },
      branch: 'stable',
      buildTypes: ['Build 1', 'Build 2', 'Build 3'],
      updateStateInterval: 9999,
    };
    fs.readFileSync.mockReturnValue(JSON.stringify(mockSettings));
    const newTime = new Date(2020, 9, 19, 19, 28, 35);
    Date.now.mockReturnValue(newTime.getTime());

    expect(updateLastChangedStatusTimeSpy).toHaveBeenCalledTimes(0);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(0);
    const settingsStorage = new SettingsStorage('settings.json');

    expect(updateLastChangedStatusTimeSpy).toHaveBeenCalledTimes(1);
    expect(updateLastChangedStatusTimeSpy).toHaveReturnedWith(true);
    updateLastChangedStatusTimeSpy.mockClear();
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'settings.json',
      JSON.stringify(
        {
          ...mockSettings,
          lastChangedStatusTime: newTime.getTime(),
          lastStatus: '',
        },
        null,
        2
      )
    );
    fs.writeFileSync.mockClear();

    settingsStorage.updateLastChangedStatusTime('success');
    expect(settingsStorage.settings().lastChangedStatusTime).toStrictEqual(
      newTime.getTime()
    );
    expect(settingsStorage.settings().lastStatus).toStrictEqual('success');

    expect(updateLastChangedStatusTimeSpy).toHaveBeenCalledTimes(1);
    expect(updateLastChangedStatusTimeSpy).toHaveReturnedWith(true);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'settings.json',
      JSON.stringify(
        {
          ...mockSettings,
          lastChangedStatusTime: newTime.getTime(),
          lastStatus: 'success',
        },
        null,
        2
      )
    );
  });

  test('updateLastChangedStatusTime update exist time setting', () => {
    const mockSettings = {
      serverUrl: 'http://localhost:8112',
      auth: { username: 'root', password: '12345' },
      branch: 'stable',
      buildTypes: ['Build 1', 'Build 2', 'Build 3'],
      updateStateInterval: 9999,
      lastChangedStatusTime: new Date(2020, 9, 19, 19, 28, 35),
      lastStatus: 'success',
    };
    fs.readFileSync.mockReturnValue(JSON.stringify(mockSettings));
    const settingsStorage = new SettingsStorage('settings.json');
    const newTime = new Date(2020, 9, 20, 21, 18, 33);
    Date.now.mockReturnValue(newTime.getTime());
    const isStatusChanged = settingsStorage.updateLastChangedStatusTime('fail');
    expect(isStatusChanged).toBeTruthy();
    expect(settingsStorage.settings().lastChangedStatusTime).toStrictEqual(
      newTime.getTime()
    );
    expect(settingsStorage.settings().lastStatus).toStrictEqual('fail');

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'settings.json',
      JSON.stringify(
        {
          ...mockSettings,
          lastChangedStatusTime: newTime.getTime(),
          lastStatus: 'fail',
        },
        null,
        2
      )
    );
  });

  test('updateLastChangedStatusTime not updated when status not changed', () => {
    const mockSettings = {
      serverUrl: 'http://localhost:8112',
      auth: { username: 'root', password: '12345' },
      branch: 'stable',
      buildTypes: ['Build 1', 'Build 2', 'Build 3'],
      updateStateInterval: 9999,
      lastChangedStatusTime: new Date(2020, 9, 19, 19, 28, 35).getTime(),
      lastStatus: 'success',
    };
    fs.readFileSync.mockReturnValue(JSON.stringify(mockSettings));
    const settingsStorage = new SettingsStorage('settings.json');
    const newTime = new Date(2020, 9, 20, 21, 18, 33);
    Date.now.mockReturnValue(newTime.getTime());
    const isStatusChanged =
      settingsStorage.updateLastChangedStatusTime('success');
    expect(isStatusChanged).toBeFalsy();
    expect(settingsStorage.settings().lastChangedStatusTime).toStrictEqual(
      mockSettings.lastChangedStatusTime
    );
    expect(settingsStorage.settings().lastStatus).toStrictEqual('success');

    expect(fs.writeFileSync).toHaveBeenCalledTimes(0);
  });
});
