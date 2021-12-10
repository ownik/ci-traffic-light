const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const SettingsStorage = require('./src/SettingsStorage');
const StateReciever = require('./src/StateReciever');

let eventsHandlers;
try {
  eventsHandlers = require('./eventsHandlers');
} catch (e) {
  eventsHandlers = null;
}

const settingsStorage = new SettingsStorage('./settings.json');
const stateReciever = new StateReciever(settingsStorage, eventsHandlers);

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.set('json spaces', 2);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/settings.json', (req, res) => {
  res.json(settingsStorage.settings());
});

app.get('/state.json', async (req, res) => {
  res.json(stateReciever.state());
});

module.exports = app;
