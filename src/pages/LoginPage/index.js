import React, { Component } from 'react'
import Login from '../../components/Login'
import Signup from '../../components/Signup'

import './style.css'

class LoginPage extends Component {
  constructor() {
    super()
    this.state = {
      user: false,
      isLoading: false
    }
    this.login = this.login.bind(this)
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    fetch(`http://localhost:1268/api/user`, {
      credentials: 'include'
    })
    .then(
      res => this.setState({ user: res.ok, isLoading: false }),
      err => { this.setState({ isLoading: false }); console.error(err) }
    )
  }

  login(user) {
    fetch(`http://localhost:1268/api/user/login`, {
      method: "POST",
      body: JSON.stringify(user),
      credentials: 'include',
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then(res => {this.setState({ user: !!res }); console.log(res)})
  }

  render() {
    return (
      <div id="login-page">
        {
          this.state.isLoading
            ? "loading"
            : this.state.user
              ? "Already logged in"
              : <Login onSubmit={this.login} />
        }
        <button onClick={() => {
          fetch(`http://localhost:1268/api/user`, { credentials: 'include' })
          .then(res => console.log(res))
        }}>get user</button>
      </div>
    )
  }
}

export default LoginPage
