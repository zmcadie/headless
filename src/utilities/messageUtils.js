import React from "react"
import styled from "styled-components"

const RollContainer = styled.span`
  font-weight: bold;

  .roll-hover {
    background: #ddd;
    display: none;
    margin-left: 3px;
    padding: 0 5px;
  }

  &:hover {
    .roll-hover {
      display: inline-block;
    }
  }
`

const RollDisplay = ({ rollObj }) => {
  const { roll, rolls, modifier, total } = rollObj
  return (
    <RollContainer>
      <span className="roll-total">{total}</span>
      <div className="roll-hover">
        {roll}[{rolls.map((m, i) => i < rolls.length - 1 ? m + ', ' : m)}]{modifier === '+0' ? '' : modifier}
      </div>
    </RollContainer>
  )
}

const handleDiceRoll = (roll, i) => {
  const rollRegex = /{(\d+)d(\d+)([+-]\d+)?}/i
  const data = rollRegex.exec(roll)
  const number = data[1]
  const type = data[2]
  const modifier = data[3] || '+0'
  const rolls = []
  for (let i = 0; i < number; i++) {
    let r = Math.ceil(Math.random() * type)
    rolls.push(r)
  }
  const res = {
    roll: `${number}d${type}`,
    rolls,
    modifier,
    total: rolls.reduce((a, c) => a + c) + parseInt(modifier, 10)
  }
  return <RollDisplay key={i} rollObj={res} />
}

const handleMessage = (msg) => {
  const diceRegex = /({\d+d\d+(?:[+-]\d+)?})/gi
  const msgArr = msg.content.split(diceRegex).map((m, i) => {
    return diceRegex.test(m)
    ? handleDiceRoll(m, i)
    : m
  })
  msg.content = <span>{msgArr}</span>
  return msg
}

export default handleMessage