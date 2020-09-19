const SettingsStorage = require("../src/SettingsStorage");
const fs = require("fs");

jest.mock("fs");

describe("Settings", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetchSettings simple 1", () => {
    const mockSettings = {
      serverUrl: "http://localhost:8111",
      auth: { username: "root", password: "123456" },
      branch: "(default:true)",
      buildTypes: ["CiIndicatorTest_Build1", "CiIndicatorTest_Build2"],
      updateStateInterval: 10000,
    };
    fs.readFileSync.mockReturnValue(JSON.stringify(mockSettings));
    const settingsStorage = new SettingsStorage("./settings.json");
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync).toHaveBeenCalledWith("./settings.json");
    expect(settingsStorage.settings()).toEqual(mockSettings);
  });

  test("fetchSettings simple 2", () => {
    const mockSettings = {
      serverUrl: "http://localhost:8112",
      auth: { username: "root", password: "12345" },
      branch: "stable",
      buildTypes: ["Build 1", "Build 2", "Build 3"],
      updateStateInterval: 9999,
    };
    fs.readFileSync.mockReturnValue(JSON.stringify(mockSettings));
    expect(
      new SettingsStorage("/etc/config/settings-external.json").settings()
    ).toEqual(mockSettings);
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync).toHaveBeenCalledWith(
      "/etc/config/settings-external.json"
    );
  });

  test("updateLastChangedStatusTime update non existed time setting", () => {
    const mockSettings = {
      serverUrl: "http://localhost:8112",
      auth: { username: "root", password: "12345" },
      branch: "stable",
      buildTypes: ["Build 1", "Build 2", "Build 3"],
      updateStateInterval: 9999,
    };
    fs.readFileSync.mockReturnValue(JSON.stringify(mockSettings));
    const settingsStorage = new SettingsStorage("settings.json");
    const newTime = new Date(2020, 9, 19, 19, 28, 35);
    settingsStorage.updateLastChangedStatusTime(newTime);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "settings.json",
      JSON.stringify(
        {
          ...mockSettings,
          lastChangedStatusTime: newTime,
        },
        2
      )
    );
  });

  test("updateLastChangedStatusTime update exist time setting", () => {
    const mockSettings = {
      serverUrl: "http://localhost:8112",
      auth: { username: "root", password: "12345" },
      branch: "stable",
      buildTypes: ["Build 1", "Build 2", "Build 3"],
      updateStateInterval: 9999,
      lastChangedStatusTime: new Date(2020, 9, 19, 19, 28, 35).getTime(),
    };
    fs.readFileSync.mockReturnValue(JSON.stringify(mockSettings));
    const settingsStorage = new SettingsStorage("settings.json");
    const newTime = new Date(2020, 9, 20, 21, 18, 33).getTime();
    settingsStorage.updateLastChangedStatusTime(newTime);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "settings.json",
      JSON.stringify(
        {
          ...mockSettings,
          lastChangedStatusTime: newTime,
        },
        2
      )
    );
  });
});
