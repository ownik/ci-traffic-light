const fs = require('fs');

class SettingsStorage {
  constructor(file) {
    this._file = file;
    this._settings = JSON.parse(fs.readFileSync(this._file));
    if (!this._settings.hasOwnProperty('lastChangedStatusTime')) {
      this.updateLastChangedStatusTime();
    }
  }

  settings() {
    return this._settings;
  }

  updateLastChangedStatusTime() {
    this._settings.lastChangedStatusTime = Date.now();
    fs.writeFileSync(this._file, JSON.stringify(this._settings, null, 2));
  }
}

module.exports = SettingsStorage;
