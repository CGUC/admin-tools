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
          <div className="stats">
            {/* this.getStatsJSON() */}
            <div className="stats-overview">
              {this.getStatsOverview()}
            </div>
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

  getStatsJSON = () => {
    if (this.state.loading) {
      return (<Spinner loading={this.state.loading}/>)
    }
    return (<div><pre>{JSON.stringify(this.state.stats, null, 2) }</pre></div>);
  }

  getStatsOverview = () => {
    if (this.state.loading) {
      return (<Spinner loading={this.state.loading}/>)
    }
    let counts = this.state.stats.counts;
    return (
      <div className="grid-container">
        <Card>
          <div><b>Users:</b> {counts.users}</div>
          <div><b>Channels:</b> {counts.channels}</div>
          <div><b>Posts:</b> {counts.posts}</div>
          <div><b>Likes:</b> {counts.likes}</div>
          <div><b>Comments:</b> {counts.comments}</div>
        </Card>
        <Card>
          {this.getStatsJSON()}
        </Card>
      </div>
    )
  }
}

export default withRouter(Analytics);
