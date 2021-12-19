const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const winston = require('winston');
const expressWinston = require('express-winston');
const SettingsStorage = require('./src/SettingsStorage');
const StateReciever = require('./src/StateReciever');

let eventsHandlers;
try {
  eventsHandlers = require(path.resolve('./eventsHandlers'));
  winston.info(`Custom events handlers loaded successfully`);
} catch (e) {
  eventsHandlers = null;
  if (e.code !== 'MODULE_NOT_FOUND') winston.error(`${e}`);
}

const settingsStorage = new SettingsStorage('./settings.json');
const stateReciever = new StateReciever(settingsStorage, eventsHandlers);

const app = express();
app.set('port', settingsStorage.settings().port || 8080);
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'server.log' }),
    ],
    format: winston.format.combine(
      winston.format((info) => {
        info.level = info.level.toUpperCase();
        return info;
      })(),
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:SS',
      }),
      winston.format.printf(
        (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
      )
    ),
    meta: false,
    expressFormat: true,
    skip: (req, res) => {
      return res.statusCode === 304;
    },
  })
);
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
