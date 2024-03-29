const fs = require('fs');

class SettingsStorage {
  constructor(file) {
    this._file = file;
    this._settings = JSON.parse(fs.readFileSync(this._file));
    if (!('lastChangedStatusTime' in this._settings)) {
      this.updateLastChangedStatusTime('');
    }
  }

  settings() {
    return this._settings;
  }

  updateLastChangedStatusTime(status) {
    if (this._settings.lastStatus != status) {
      this._settings.lastChangedStatusTime = Date.now();
      this._settings.lastStatus = status;
      fs.writeFileSync(this._file, JSON.stringify(this._settings, null, 2));
      return true;
    }
    return false;
  }
}

module.exports = SettingsStorage;
