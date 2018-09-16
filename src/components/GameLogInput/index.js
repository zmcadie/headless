import React from 'react';
import './style.css';

const GameLogInput = ({ onSubmit }) => {
  const submit = event => {
    if (event.key !== "Enter") return false
    onSubmit({ content: event.target.value })
    event.target.value = ""
  }
  return (
    <input id="game-log-input" onKeyPress={submit} />
  )
}

export default GameLogInput
