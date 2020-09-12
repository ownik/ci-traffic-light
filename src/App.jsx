import React, { Component } from 'react';
import './App.css';

import LightIndicatorScreen from './LightIndicatorScreen';
import TimerLabel from './TimerLabel';

import axios from 'axios';
import { Teamcity } from './Teamcity';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date(Date.now()),
      now: new Date(Date.now()),
      checkStateResult: {},
    };
    this.timerEvent = this.timerEvent.bind(this);
  }

  componentDidMount() {
    this.updateStateTime = 0;
    this.fetchSettings().then((responce) => {
      this.settings = responce.data;
      const { serverUrl, auth, branch } = this.settings;
      this.teamcity = new Teamcity(serverUrl, auth, branch);
      this.updateState();
      this.interval = setInterval(() => this.timerEvent(), 1000);
    });
  }

  fetchSettings() {
    return axios.get('/settings.json');
  }

  updateState() {
    this.teamcity.checkState(this.settings.buildTypes).then((result) => {
      this.setState({ checkStateResult: result });
    });
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
    const { now, time, checkStateResult } = this.state;
    return (
      <LightIndicatorScreen {...checkStateResult}>
        <TimerLabel now={now} time={time} status={checkStateResult.status} />
      </LightIndicatorScreen>
    );
  }
}

export default App;
