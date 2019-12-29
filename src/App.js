import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Analytics from './components/Analytics/Analytics';
import Channels from './components/Channels/Channels';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import Users from './components/Users/Users';
import Header from './components/Header/Header';
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Header />

        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/dashboard" component={Dashboard}/>
          <Route path="/channels" component={Channels}/>
          <Route path="/users" component={Users}/>
          <Route path="/analytics" component={Analytics}/>
          
          <Redirect from='/' to='/channels' />
        </Switch>
      </div>
    );
  }
}

export default App;
