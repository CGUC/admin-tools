import React, { Component } from 'react';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { Card, CardHeader } from '../Shared/Card';
import { Button } from '../Shared/Button';
import Spinner from '../Shared/Loader';
import Controller from './AnalyticsController';
import './Analytics.css';

class Analytics extends Component {
  constructor(props) {
    super(props)

    this.state = {
      stats: [],
      loading: true
    };
  }

  render() {
    return !localStorage.getItem('token') ? <Redirect to='/login'/> :
    (
      <div className='analytics'>
        <Card>
          <CardHeader>
            Analytics
          </CardHeader>
          <div className="stats-list">
            <Spinner loading={this.state.loading}/>
            {this.getStats()}
          </div>
        </Card>
      </div>
    );
  }

  async componentDidMount() {
    const response = await Controller.getStats(localStorage.getItem('token'));
    this.setState({
      loading: false,
      stats: response,
    });
  }

  getStats = () => {
    let stats = [];

    stats.push(
      <div key="1"><pre>{JSON.stringify(this.state.stats, null, 2) }</pre></div>
    )
  
    return stats;
  }
}

export default withRouter(Analytics);
