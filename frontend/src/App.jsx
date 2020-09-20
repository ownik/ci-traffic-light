import React, { Component } from 'react';
import './App.css';

import LightIndicatorScreen from './LightIndicatorScreen';
import TimerLabel from './TimerLabel';

import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastChangedStatusTime: Date.now(),
      now: Date.now(),
      checkStateResult: {},
    };
    this.timerEvent = this.timerEvent.bind(this);
  }

  componentDidMount() {
    this.updateStateTime = 0;
    this.fetchSettings().then((responce) => {
      this.settings = responce.data;
      this.setState({
        lastChangedStatusTime: this.settings.lastChangedStatusTime,
      });
      this.updateState();
      this.interval = setInterval(() => this.timerEvent(), 1000);
    });
  }

  fetchSettings() {
    return axios.get('/settings.json');
  }

  fetchState() {
    return axios.get('/state.json');
  }

  updateState() {
    this.fetchState().then((responce) => {
      const { items, status, lastChangedStatusTime } = responce.data;
      this.setState({
        checkStateResult: { items, status },
        lastChangedStatusTime,
      });
    });
  }

  timerEvent() {
    this.setState({ now: Date.now() });
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
    const { now, lastChangedStatusTime, checkStateResult } = this.state;
    return (
      <LightIndicatorScreen {...checkStateResult}>
        <TimerLabel
          now={now}
          time={lastChangedStatusTime}
          status={checkStateResult.status}
        />
      </LightIndicatorScreen>
    );
  }
}

export default App;
