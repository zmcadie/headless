const handleDiceRoll = (roll) => {
  console.log(roll)
  const rollRegex = /{(\d+)d(\d+)([+-]\d+)?}/i
  const data = rollRegex.exec(roll)
  console.log(data)
  const number = data[1]
  const type = data[2]
  const modifier = data[3] || 0
  const rolls = []
  for (let i = 0; i < number; i++) {
    let r = Math.ceil(Math.random() * type)
    rolls.push(r)
  }
  return rolls.reduce((a, c) => a + c) + parseInt(modifier, 10)
}

const handleMessage = (msg) => {
  const diceRegex = /{\d+d\d+([+-]\d+)?}/gi
  const matches = msg.content.match(diceRegex)
  if (matches) matches.map(m => {
    const res = handleDiceRoll(m)
    msg.content = msg.content.replace(m, res)
    return false
  })
  return msg
}

export default handleMessage