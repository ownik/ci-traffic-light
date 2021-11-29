const { Teamcity } = require('./Teamcity');

class StateReciever {
  constructor(settingsStorage) {
    this._settingsStorage = settingsStorage;
    const settings = this._settingsStorage.settings();
    this._teamcity = new Teamcity(settings);
    this._state = {};
    this.updateState().then(() => {
      this._intervalId = setInterval(() => {
        this.updateState();
      }, settings.updateStateInterval);
    });
  }

  settingsStorage() {
    return this._settingsStorage;
  }

  state() {
    return {
      ...this._state,
      lastChangedStatusTime:
        this._settingsStorage.settings().lastChangedStatusTime,
    };
  }

  updateState() {
    return this._teamcity
      .checkState(this._settingsStorage.settings().buildTypes)
      .then((state) => {
        this._settingsStorage.updateLastChangedStatusTime(state.status);
        this._state = state;
      });
  }

  stop() {
    clearInterval(this._intervalId);
    this._intervalId = null;
  }
}

module.exports = StateReciever;
