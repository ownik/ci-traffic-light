const { Teamcity } = require('./Teamcity');

class StateReciever {
  constructor(settingsStorage, eventsHandlers) {
    this._settingsStorage = settingsStorage;
    this._eventsHandlers = eventsHandlers;
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
        const isStatusChanged =
          this._settingsStorage.updateLastChangedStatusTime(state.status);
        if (isStatusChanged) {
          this._eventsHandlers.statusChanged(state.status, state.items);
        }
        this._state = state;
      });
  }

  stop() {
    clearInterval(this._intervalId);
    this._intervalId = null;
  }
}

module.exports = StateReciever;
