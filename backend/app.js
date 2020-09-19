const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const SettingsStorage = require("./src/SettingsStorage");
const StateReciever = require("./src/StateReciever");

const settingsStorage = new SettingsStorage("./settings.json");
const stateReciever = new StateReciever(settingsStorage);

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
console.log(path.join(__dirname, "public"));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/settings.json", (req, res) => {
  res.json(settingsStorage.settings());
});

app.get("/state.json", async (req, res) => {
  res.json(stateReciever.state());
});

module.exports = app;
