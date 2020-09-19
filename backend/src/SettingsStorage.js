const fs = require("fs");

class SettingsStorage {
  constructor(file) {
    this._file = file;
    this._settings = JSON.parse(fs.readFileSync(this._file));
  }

  settings() {
    return this._settings;
  }

  updateLastChangedStatusTime(date) {
    fs.writeFileSync(
      this._file,
      JSON.stringify({ ...this._settings, lastChangedStatusTime: date }, 2)
    );
  }
}

module.exports = SettingsStorage;
