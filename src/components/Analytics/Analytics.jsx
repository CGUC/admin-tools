import React, { Component } from 'react';
import { withRouter, Redirect, Link } from 'react-router-dom';
import moment from 'moment';
import { Pie, Bar } from 'react-chartjs-2';
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
          <Card className="stats-posts-by-day" >
            {this.getPostsByDayBarChart()}
          </Card>
          <div className="grid-container">
            <Card className="stats-users-by-role">
              {this.getUserRolesPieChart()}
            </Card>
          </div>
          <div>
              {this.getStatsJSON()}
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

  getPostsByDayBarChart = () => {
    if (this.state.loading) {
      return (<Spinner loading={this.state.loading}/>)
    }

    // looks like
    // [{
    //   date: Date(2019-12-31T00:00:00.000Z),
    //   post_count: 1,
    // }, ...]
    let counts = this.state.stats.posts.by_date;

    let date = moment.utc(counts[0].date);
    let end_date = moment.utc(counts[counts.length - 1].date);
    if (date > moment.utc(end_date).subtract(7, 'd')) {
      date = moment.utc(end_date).subtract(7, 'd'); // pad dates if there aren't a lot of entries to make the graph look nicer
    }

    let labels = [];
    let data_series = [];
    for (let i = 0; date <= end_date; date.add(24, 'h')) {
      labels.push(date.format('YYYY-MM-DD'));
      if (date < moment.utc(counts[i].date)) { // there is a gap in the dates
        data_series.push(0);
      } else {
        data_series.push(counts[i].post_count);
        i += 1;
      }
    }
    let data = {
      labels: labels,
      datasets: [
        {
          label: 'Post count',
          backgroundColor: 'rgba(255,99,132)',
          data: data_series,
        }
      ]
    };

    let options = {
      legend: false,
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Date'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Post count'
          }
        }]
      }
    };

    return (
      <div>
        <h3>Posts per day</h3>
        <div className="hint-text">Timestamps are in UTC</div>
        <Bar data={data} width={100} height={30} options={options} />
      </div>
    )
  }

  getUserRolesPieChart = () => {
    if (this.state.loading) {
      return (<Spinner loading={this.state.loading}/>)
    }
    let counts = this.state.stats.users.by_role; // looks like [{_id: { role: [roles...] }, count: 2}, ...]
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
        <h3>Users by permissions</h3>
        <Pie data={data} options={options}/>
      </div>
    )
  }
}

export default withRouter(Analytics);
