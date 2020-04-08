import React, { Component } from 'react';
import './App.css';

import TimerLabel from './TimerLabel';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { time: new Date() };
  }

  render() {
    const { time } = this.state;
    return (
      <div className="App" style={{ backgroundColor: 'red' }}>
        <TimerLabel time={time} />
      </div>
    );
  }
}

export default App;
