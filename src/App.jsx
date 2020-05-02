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
    this.fetchSettings().then((json) => {
      this.settings = json.data;
    });
    this.interval = setInterval(() => this.timerEvent(), 1000);
  }

  fetchSettings() {
    return axios.get('/settings.json');
  }

  timerEvent() {
    this.setState({ now: new Date(Date.now()) });
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
