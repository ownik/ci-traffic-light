const { Teamcity } = require('./Teamcity');
const ArrayUtils = require('./ArrayUtils');

class StateReciever {
  constructor(settingsStorage, eventsHandlers) {
    this._settingsStorage = settingsStorage;
    this._eventsHandlers = eventsHandlers;
    const settings = this._settingsStorage.settings();
    this._teamcity = new Teamcity(settings);
    this._state = {};
    this.updateState(true).then(() => {
      this._intervalId = setInterval(() => {
        this.updateState(false);
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

  hasStatusChangedEventHandler() {
    return this._eventsHandlers && this._eventsHandlers.statusChanged;
  }

  hasItemsChangedEventHandler() {
    return this._eventsHandlers && this._eventsHandlers.itemsChanged;
  }

  updateState(init) {
    return this._teamcity
      .checkState(this._settingsStorage.settings().buildTypes)
      .then((state) => {
        const isStatusChanged =
          this._settingsStorage.updateLastChangedStatusTime(state.status);
        if (isStatusChanged && this.hasStatusChangedEventHandler()) {
          this._eventsHandlers.statusChanged(state.status, state.items);
        } else if (!init && this.hasItemsChangedEventHandler()) {
          const currentItemsIds = this._state.items.map((i) => i.id).sort();
          const newItemsIds = state.items.map((i) => i.id).sort();
          if (!ArrayUtils.equals(currentItemsIds, newItemsIds)) {
            const newItems = state.items.filter(
              (i) => !currentItemsIds.includes(i.id)
            );
            this._eventsHandlers.itemsChanged(
              state.status,
              state.items,
              newItems
            );
          }
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
