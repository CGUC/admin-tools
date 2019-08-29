import React, { Component } from 'react';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { defaults, Pie } from 'react-chartjs-2';
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
            <Card className="stats-users-by-role">
              {this.getUserRolesPieChart()}
            </Card>
            <div>
              {/*this.getStatsJSON()*/}
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

  getUserRolesPieChart = () => {
    if (this.state.loading) {
      return (<Spinner loading={this.state.loading}/>)
    }
    let counts = this.state.stats.users.by_role; // looks like [{_id: { role: [roles...] }, count: 2}, ...]
    console.log(counts);
    let data = {
      labels: counts.map(a => {
        let role_desc = a._id.role.join(", ");
        if (role_desc === "") role_desc = "<none>";
        return role_desc;
      }),
      datasets: [{
        data: counts.map(a => a.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
          ],
      }]
    }
    let options = { // show percentage https://stackoverflow.com/questions/37257034/chart-js-2-0-doughnut-tooltip-percentages
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var dataset = data.datasets[tooltipItem.datasetIndex];
            var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
              return previousValue + currentValue;
            });
            var currentValue = dataset.data[tooltipItem.index];
            var percentage = Math.floor(((currentValue/total) * 100)+0.5);         
            return currentValue + " (" + percentage + "%)";
          },
          title: function(tooltipItem, data) {
            return data.labels[tooltipItem[0].index];
          }
        }
      }
    }
    return (
      <div>
        <h3>User permissions</h3>
        <Pie data={data} options={options}/>
      </div>
    )

  }
}

export default withRouter(Analytics);
