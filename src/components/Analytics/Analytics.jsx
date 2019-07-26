import React, { Component } from 'react';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { Card, CardHeader } from '../Shared/Card';
import { Button } from '../Shared/Button';
import './Analytics.css';

class Analytics extends Component {
  render() {
    return !localStorage.getItem('token') ? <Redirect to='/login'/> :
    (
      <div className='analytics'>
        <Card>
          <CardHeader>
            Analytics
          </CardHeader>
        </Card>
      </div>
    );
  }
}

export default withRouter(Analytics);
