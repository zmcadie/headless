import React from 'react'
import styled from 'styled-components'
import './style.css'

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

const RollDisplay = ({ rollStr }) => {
  const rollObj = JSON.parse(rollStr)
  const { total, roll, rolls, modifier } = rollObj
  return (
    <RollContainer>
      <span className="roll-total">{total}</span>
      <div className="roll-hover">
        {roll}[{rolls.map((m, i) => i < rolls.length - 1 ? m + ', ' : m)}]{modifier === '+0' ? '' : modifier}
      </div>
    </RollContainer>
  )
}

class GameLog extends React.Component {
  constructor() {
    super()
    this.state = {
      isScrolling: false,
      showNotification: false
    }
    this.display = React.createRef()
    this.onScroll = this.onScroll.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
    this.MessagesNotification = this.MessagesNotification.bind(this)
  }

  onScroll(e) {
    const el = e.target
    const { offsetHeight, scrollHeight, scrollTop } = el
    const { isScrolling } = this.state
    if (scrollHeight - offsetHeight === scrollTop && !isScrolling) return false
    if (scrollHeight - offsetHeight !== scrollTop && isScrolling) return false
    if (isScrolling) this.setState({ showNotification: false, isScrolling: false })
    else this.setState({ isScrolling: true })
  }

  scrollToBottom() {
    const display = this.display.current
    const { offsetHeight: displayHeight, scrollHeight: logHeight } = display
    const diff = logHeight - displayHeight
    if (diff > 0) display.scrollTo(0, diff)
  }

  MessagesNotification() {
    return <div id="messages-notification"><span onClick={this.scrollToBottom}>scroll to new messages</span></div>
  }

  componentDidMount() {
    this.scrollToBottom()
    this.display.current.addEventListener('scroll', e => this.onScroll(e))
  }

  componentWillUnmount() {
    this.display.current.removeEventListener('scroll', e => this.onScroll(e))
  }

  componentDidUpdate(prevProps) {
    if (prevProps.log !== this.props.log) {
      if (!this.state.isScrolling) this.scrollToBottom()
      else if (!this.state.showNotification) this.setState({ showNotification: true })
    }
  }

  render() {
    const formatRegex = /({.+})/g
    const { log } = this.props
    const logItems = log.map(entry => {
      return (
        <div className="log-item" key={entry._id}>
          {entry.content.split(formatRegex).map((str, i) => {
            const key = entry._id + '-' + i
            return formatRegex.test(str) ? <RollDisplay key={key}rollStr={str} /> : str
          })}
        </div>
      )
    })
    return (
      <div id="log-display" ref={this.display}>
        {logItems}
        {this.state.showNotification ? <this.MessagesNotification /> : ''}
      </div>
    )
  }
}

export default GameLog
