import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import GameDisplay from './pages/GameDisplay';
import CharacterPage from './pages/CharacterPage';
import Login from './components/Login';
import Logout from './components/Logout';
import Signup from './components/Signup';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" render={() => <Redirect to="/login" />} />
          <Route path="/login" component={Login} />
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
