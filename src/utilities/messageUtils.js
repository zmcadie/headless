const handleDiceRoll = (arr) => {
  if (!arr) return false
  const number = arr[1]
  const type = arr[2]
  const modifier = arr[3]
  const rolls = []
  for (let i = 0; i < number; i++) {
    let roll = Math.ceil(Math.random() * type)
    if (modifier) roll = roll + parseInt(modifier, 10)
    rolls.push(roll)
  }
  return rolls.reduce((a, c) => a + c)
}

const handleMessage = (msg) => {
  const diceRegex = /{(\d+)d(\d+)([+-]\d+)?}/gi
  const match = diceRegex.exec(msg.content)
  if (match) {
    const roll = handleDiceRoll(match)
    msg.content = msg.content.replace(match[0], roll)
  }
  return msg
}

export default handleMessage