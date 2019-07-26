import React, { Component } from 'react';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { Card, CardHeader } from '../Shared/Card';
import { Button } from '../Shared/Button';
import './Channels.css';

class Channels extends Component {
  render() {
    return !localStorage.getItem('token') ? <Redirect to='/login'/> :
    (
      <div className='channels'>
        <Card>
          <CardHeader>
            Channel List
          </CardHeader>

          <div>
            <Button primary width='150px'>Create</Button>
            <Button width='150px'>Delete</Button>
          </div>
        </Card>
      </div>
    );
  }
}

export default withRouter(Channels);
