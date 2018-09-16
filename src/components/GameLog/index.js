import React from 'react';
import './style.css';

const uuid = require ('uuid/v4')

const GameLog = ({ log }) => {
  return (
    <div className="log-display">
      {log.map(entry => <div className="log-item" key={uuid()}>{entry.content}</div>)}
    </div>
  )
}

export default GameLog
