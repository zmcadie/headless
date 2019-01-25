import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import GameDisplay from './pages/GameDisplay';
import CharacterPage from './pages/CharacterPage';
import LoginPage from './pages/LoginPage';
import Logout from './components/Logout';
import Signup from './components/Signup';
import LoadingIcon from './components/LoadingIcon';
import './App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      user: false,
      isLoading: true
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    fetch(`http://localhost:1268/api/user`, {
      credentials: 'include'
    }).then(res => {
      return res.json()
    }).then(
      res => this.setState({ user: res, isLoading: false }),
      err => { this.setState({ isLoading: false }); console.error(err) }
    )
  }

  render() {
    return (
      <Router>
        <div id="router-container">
          <div id="app-header">{`${this.state.user.username}`}</div>
          <LoadingIcon />
          <Route exact path="/" render={() => <Redirect to="/login" />} />
          <Route path="/login" component={LoginPage} />
          <Route path="/logout" component={Logout} />
          <Route path="/signup" component={Signup} />
          <Route path="/game/:id" component={GameDisplay} />
          <Route exact path="/character" render={() => <Redirect to="/character/new" />} />
          <Route path="/character/:id" component={CharacterPage} />
        </div>
      </Router>
    );
  }
}

export default App;
