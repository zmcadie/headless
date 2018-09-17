const handleDiceRoll = (roll) => {
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
    total: rolls.reduce((a, c) => a + c) + parseInt(modifier, 10),
    roll: `${number}d${type}`,
    rolls,
    modifier
  }
  return JSON.stringify(res)
}

const handleMessage = (msg) => {
  const diceRegex = /({\d+d\d+(?:[+-]\d+)?})/gi
  msg.content = msg.content.split(diceRegex).map((m, i) => {
    return diceRegex.test(m)
    ? handleDiceRoll(m, i)
    : m
  }).join('')
  return msg
}

export default handleMessage