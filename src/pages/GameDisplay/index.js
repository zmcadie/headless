import React, { Component } from 'react'
import GameLog from '../../components/GameLog'
import GameLogInput from '../../components/GameLogInput'
import handleMessage from '../../utilities/messageUtils'

import './style.css'

export default class GameDisplay extends Component {
  constructor() {
    super()
    this.state = {
      log: []
    }
    this.addLogItem = this.addLogItem.bind(this)
  }

  componentDidMount() {
    const { match: { params: { id } } } = this.props
    if (id === "new") {
      fetch(`http://localhost:1268/api/logs`, {
        method: "POST",
        body: JSON.stringify([]),
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()).then(res => this.props.history.push(`./${res._id}`))
    } else {
      this.loadLogItems(id)
    }
  }

  createNewLog() {

  }

  loadLogItems(id) {
    fetch(`http://localhost:1268/api/logs/${id}`)
    .then(res => res.json()).then(res => this.setState({log: res.logItems}))
  }

  addLogItem(item) {
    const newMsg = handleMessage(item)
    const logItems = [...this.state.log, newMsg]
    fetch(`http://localhost:1268/api/logs/${this.props.match.params.id}`, {
      method: "PUT",
      body: JSON.stringify({logItems}),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then(res => this.setState({log: res.logItems}))
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