import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import GameDisplay from './components/GameDisplay';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" render={() => <Redirect to="/game/5b9f42cec1c8e02ef22a07da" />} />
          <Route path="/game/:id" component={GameDisplay} />
        </div>
      </Router>
    );
  }
}

export default App;
