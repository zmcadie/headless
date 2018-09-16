import React from 'react';
import './style.css';

const uuid = require ('uuid/v4')

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
    const { log } = this.props
    return (
      <div id="log-display" ref={this.display}>
        {log.map(entry => <div className="log-item" key={uuid()}>{entry.content}</div>)}
        {this.state.showNotification ? <this.MessagesNotification /> : ''}
      </div>
    )
  }
}

export default GameLog
