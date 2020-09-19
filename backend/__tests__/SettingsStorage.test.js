const SettingsStorage = require("../src/SettingsStorage");
const fs = require("fs");

jest.mock("fs");

describe("Settings", () => {
  afterEach(() => {
    fs.readFileSync.mockClear();
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
    expect(new SettingsStorage("./settings.json").settings()).toEqual(
      mockSettings
    );
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync).toHaveBeenCalledWith("./settings.json");
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
});
