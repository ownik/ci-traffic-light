import React, { Component } from 'react';
import './App.css';

import LightIndicatorScreen from './LightIndicatorScreen';
import TimerLabel from './TimerLabel';

import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { time: new Date(Date.now()), now: new Date(Date.now()) };
    this.timerEvent = this.timerEvent.bind(this);
  }

  componentDidMount() {
    this.updateStateTime = 0;
    this.fetchSettings()
      .then((responce) => {
        this.settings = responce.data;
        return this.connect();
      })
      .then((response) => {
        this.updateState();
        this.interval = setInterval(() => this.timerEvent(), 1000);
        console.log(JSON.stringify(response));
      });
  }

  fetchSettings() {
    return axios.get('/settings.json');
  }

  connect() {
    return axios.get('');
  }

  updateState() {
    axios.get('123123');
  }

  timerEvent() {
    this.setState({ now: new Date(Date.now()) });
    this.updateStateTime += 1000;
    if (this.updateStateTime >= this.settings.updateStateInterval) {
      this.updateState();
      this.updateStateTime = 0;
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { now, time } = this.state;
    return (
      <LightIndicatorScreen status="fail">
        <TimerLabel now={now} time={time} />
      </LightIndicatorScreen>
    );
  }
}

export default App;
