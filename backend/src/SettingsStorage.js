const fs = require("fs");

class SettingsStorage {
  constructor(file) {
    this.__file = file;
  }

  settings() {
    return JSON.parse(fs.readFileSync(this.__file));
  }
}

module.exports = SettingsStorage;
