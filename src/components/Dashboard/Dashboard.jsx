import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { Card, CardHeader } from '../Shared/Card';
import './Dashboard.css';

class Dashboard extends Component {
  render() {
    return !localStorage.getItem('token') ? <Redirect to='/login'/> :
    (
      <div className='dashboard'>

        <Card className='analyticsCard'>
          <CardHeader>
            Analytics Overview
          </CardHeader>
          <div className="analytics">
            TODO
          </div>
        </Card>

        <Card>
          <CardHeader>
            Channels Overview
          </CardHeader>
          <div className="channels">
            TODO
          </div>
        </Card>

        <Card>
          <CardHeader>
            Users Overview
          </CardHeader>
          <div className="Users">
            TODO
          </div>
        </Card>
      </div>
    );
  }
}

export default withRouter(Dashboard);
