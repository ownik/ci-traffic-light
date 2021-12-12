const request = require('supertest');
const path = require('path');
const SettingsStorage = require('../src/SettingsStorage');
const StateReciever = require('../src/StateReciever');

jest.mock('../src/SettingsStorage');
jest.mock('../src/StateReciever');

const mockSettings = {
  serverUrl: 'http://localhost:8112',
  auth: { username: 'root', password: '12345' },
  branch: 'stable',
  buildTypes: ['Build 1', 'Build 2', 'Build 3'],
  updateStateInterval: 9999,
  lastChangedStatusTime: new Date(2020, 9, 20, 16, 55, 11).getTime(),
};

const mockState = {
  items: [
    {
      id: 'Build 1',
      displayName: 'Build 1',
      investigators: ['user1'],
      running: false,
    },
    {
      id: 'Build 2',
      displayName: 'Build 2',
      investigators: ['user1'],
      running: false,
    },
  ],
  status: 'fail',
  lastChangedStatusTime: new Date(2020, 9, 20, 16, 55, 11).getTime(),
};

describe('App', () => {
  beforeEach(() => {
    jest.useFakeTimers('legacy');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('/settings.json should return settings from SettingsStorage', async () => {
    SettingsStorage.prototype.settings.mockReturnValue(mockSettings);

    expect(SettingsStorage).toHaveBeenCalledTimes(0);
    expect(SettingsStorage.prototype.settings).toHaveBeenCalledTimes(0);
    expect(StateReciever).toHaveBeenCalledTimes(0);

    let app;
    jest.isolateModules(() => {
      app = require('../app');
    });

    expect(SettingsStorage).toHaveBeenCalledTimes(1);
    expect(SettingsStorage.prototype.settings).toHaveBeenCalledTimes(1);

    SettingsStorage.mockClear();
    SettingsStorage.prototype.settings.mockClear();

    expect(StateReciever).toHaveBeenCalledTimes(1);
    expect(StateReciever).toHaveBeenCalledWith(
      expect.any(SettingsStorage),
      null
    );

    const responce = await request(app).get('/settings.json');

    expect(SettingsStorage).toHaveBeenCalledTimes(0);
    expect(SettingsStorage.prototype.settings).toHaveBeenCalledTimes(1);

    expect(responce.status).toEqual(200);
    expect(responce.body).toEqual(mockSettings);
  });

  test('/state.json should return state from Teamcity', async () => {
    SettingsStorage.prototype.settings.mockReturnValue(mockSettings);
    StateReciever.prototype.state.mockReturnValue(mockState);

    let app;
    jest.isolateModules(() => {
      app = require('../app');
    });

    const responce = await request(app).get('/state.json');

    expect(responce.body).toEqual({
      ...mockState,
      lastChangedStatusTime: mockSettings.lastChangedStatusTime,
    });
    expect(responce.status).toEqual(200);
  });

  test('check StateReciever constuctor - no eventHandlers', async () => {
    SettingsStorage.prototype.settings.mockReturnValue(mockSettings);

    jest.isolateModules(() => {
      require('../app');
    });

    expect(StateReciever).toHaveBeenCalledTimes(1);
    expect(StateReciever).toHaveBeenCalledWith(
      expect.any(SettingsStorage),
      null
    );
  });

  test('check StateReciever constuctor - has eventHandlers', async () => {
    SettingsStorage.prototype.settings.mockReturnValue(mockSettings);

    const eventsHandlersMock = {
      statusChanged: jest.fn(),
      itemsChanged: jest.fn(),
    };

    jest.doMock(path.resolve('./eventsHandlers'), () => eventsHandlersMock, {
      virtual: true,
    });
    jest.isolateModules(() => {
      require('../app');
    });

    expect(StateReciever).toHaveBeenCalledTimes(1);
    expect(StateReciever).toHaveBeenCalledWith(
      expect.any(SettingsStorage),
      eventsHandlersMock
    );
  });
});
