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
          <div className="grid-container">
            <Card className="stats-overview">
              {this.getStatsOverview()}
            </Card>
            <Card className="stats-recent-post-counts">
              {this.getRecentPostCounts()}
            </Card>
            <Card className="stats-recent-comment-counts">
              {this.getRecentCommentCounts()}
            </Card>
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
      <div>
        <h3>Overview</h3>
        <table className="table">
          <tbody className="stats-summary">
          <tr><td>Channels:</td><td>{counts.channels}</td></tr>
          <tr><td>Users:</td><td>{counts.users}</td></tr>
          <tr><td>Posts:</td><td>{counts.posts}</td></tr>
          <tr><td>Likes:</td><td>{counts.likes}</td></tr>
          <tr><td>Comments:</td><td>{counts.comments}</td></tr>
          </tbody>
        </table>
      </div>
    )
  }

  getRecentPostCounts = () => {
    if (this.state.loading) {
      return (<Spinner loading={this.state.loading}/>)
    }
    let counts = this.state.stats.posts.recent_counts;
    return (
      <div>
        <h3>Posts</h3>
        <table className="table">
          <tbody className="stats-summary">
            <tr><td>In the past 24 hours:</td><td>{counts.past_24h}</td></tr>
            <tr><td>In the past 3 days:</td><td>{counts.past_3d}</td></tr>
            <tr><td>In the past 7 days:</td><td>{counts.past_7d}</td></tr>
            <tr><td>In the past 30 days:</td><td>{counts.past_30d}</td></tr>
          </tbody>
        </table>
      </div>
    )
  }

  getRecentCommentCounts = () => {
    if (this.state.loading) {
      return (<Spinner loading={this.state.loading}/>)
    }
    let counts = this.state.stats.comments.recent_counts;
    return (
      <div>
        <h3>Comments</h3>
        <table className="table">
          <tbody className="stats-summary">
            <tr><td>In the past 24 hours:</td><td>{counts.past_24h}</td></tr>
            <tr><td>In the past 3 days:</td><td>{counts.past_3d}</td></tr>
            <tr><td>In the past 7 days:</td><td>{counts.past_7d}</td></tr>
            <tr><td>In the past 30 days:</td><td>{counts.past_30d}</td></tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default withRouter(Analytics);
