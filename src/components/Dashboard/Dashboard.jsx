import React, { Component } from 'react';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { Card, CardHeader } from '../Shared/Card';
import './Dashboard.css';

class Dashboard extends Component {
  render() {
    return !localStorage.getItem('token') ? <Redirect to='/login'/> :
    (
      <div className='dashboard'>
        <Link className='analyticsCard gridItem' to='/analytics'>
          <Card>
            <CardHeader>
              Analytics Overview
            </CardHeader>
            <div className="analytics">
              TODO
            </div>
          </Card>
        </Link>

        <Link className='gridItem' to='/Channels'>
          <Card>
            <CardHeader>
              Channels Overview
            </CardHeader>
            <div className="channels">
              TODO
            </div>
          </Card>
        </Link>

        <Link className='gridItem' to='/Users'>
          <Card>
            <CardHeader>
              Users Overview
            </CardHeader>
            <div className="Users">
              TODO
            </div>
          </Card>
        </Link>
      </div>
    );
  }
}

export default withRouter(Dashboard);
