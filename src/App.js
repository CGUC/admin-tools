import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

class App extends Component {

  render() {
    return (
      <div>

        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/dashboard" component={Dashboard}/>
          
          <Redirect from='/' to='/login' />
        </Switch>
      </div>
    );
  }
}

export default App;