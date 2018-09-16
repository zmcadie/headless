import React, { Component } from 'react';
import GameLog from '../GameLog';
import GameLogInput from '../GameLogInput';
import handleMessage from '../../utilities/messageUtils';

import './style.css';

export default class GameDisplay extends Component {
  constructor() {
    super()
    this.state = {
      log: [
        { content: "Welcome to Headless!" },
        { content: "Just start typing and let the adventure begin..." },
      ]
    }
    this.addLogItem = this.addLogItem.bind(this)
  }

  addLogItem(item) {
    const newMsg = handleMessage(item)
    this.setState({ log: [...this.state.log, newMsg] })
  }

  render() {
    return (
      <div className="game-display">
        <GameLog log={this.state.log} />
        <GameLogInput onSubmit={this.addLogItem}/>
      </div>
    )
  }
}