import React, { Component } from 'react';
import { withRouter, Redirect, Link } from 'react-router-dom';
import moment from 'moment';
import { Pie, Bar, Bubble, Line } from 'react-chartjs-2';
import { Card, CardHeader } from '../Shared/Card';
import { Button } from '../Shared/Button';
import Spinner from '../Shared/Loader';
import Controller from './AnalyticsController';
import './Analytics.css';

const backgroundColorPalette = [ // TODO: these are just ad-hoc hard-coded values for now; where to get a better colour palette?
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#33a02c',
  '#6a3d9a',
  '#ff7f00',
  '#a6cee3',
  '#b2df8a',
  '#fdbf6f',
  '#cab2d6',
  '#ffff99',
  '#b15928',
]

class Analytics extends Component {
  constructor(props) {
    super(props)

    this.state = {
      stats: [],
      loading: true,
      error: false,
      jsonOpen: false
    };
  }

  async componentDidMount() {
    const response = await Controller.getStats(localStorage.getItem('token'));
    if (!response.error) {
      this.setState({
        loading: false,
        stats: response,
      });
    } else {
      this.setState({
        error: true,
      })
    }
  }

  render() {
    return !localStorage.getItem('token') ? <Redirect to='/login'/> :
    (
      <div className='analytics'>
        <Card>
          <CardHeader>
            Analytics
          </CardHeader>
          {this.state.error ?
          <Card className="error-msg">
            Error: Something went wrong when trying to communicate with the server.
          </Card>
          : null}
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
          <div className="grid-container">
            <Card className="stats-posts-by-channel">
              {this.getPostsByChannelPieChart()}
            </Card>
            <Card className="stats-posts-by-channel">
              {this.getCommentsByChannelPieChart()}
            </Card>
          </div>
          <div className="grid-container">
            <Card className="stats-users-by-role">
              {this.getUserRolesPieChart()}
            </Card>
            <Card className="stats-subscribers-by-channel">
              {this.getUserSubscriptionsByChannelPieChart()}
            </Card>
          </div>
          <Card className="stats-posts-comments-by-day">
            {this.getPostsAndCommentsByDayBarChart()}
          </Card>
          <Card className="stats-time-card">
            {this.getTimeCardBubblePlot()}
          </Card>
          <Card className="stats-contributing-users">
            {this.getContributingUsersByDayBarChart()}
          </Card>
          <div>
            <Button className="collapsible-content" onClick={ (e) => {
              this.setState({jsonOpen: !this.state.jsonOpen});
            }}>Show Raw JSON data</Button>
            {this.state.jsonOpen ? (
              <div className="content">
              {this.getStatsJSON()}
              </div>
              ) : null}
          </div>
        </Card>
      </div>
    );
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

  getPostsByChannelPieChart = () => {
    if (this.state.loading) {
      return (<Spinner loading={this.state.loading}/>)
    }
    
    let counts = this.state.stats.posts.by_channel;
    // looks like:
    // [{
    //   _id: { tags: ["test"] },
    //   post_count: 1,
    //   like_count: 2,
    //   comment_count: 3,
    // }, ...]
    counts = counts.slice().reverse(); // reverse array so that oldest channels are first

    let data = {
      labels: counts.map(a => {
        let tag_desc = a._id.tags.join(", ");
        return tag_desc;
      }),
      datasets: [{
        label: "post_count",
        data: counts.map(a => a.post_count),
        backgroundColor: backgroundColorPalette
      }]
    }
    let options = {
      tooltips: { // show percentage https://stackoverflow.com/questions/37257034/chart-js-2-0-doughnut-tooltip-percentages
        callbacks: {
          label: function(tooltipItem, data) {
            let dataset = data.datasets[tooltipItem.datasetIndex];
            let total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
              return previousValue + currentValue;
            });
            let currentValue = dataset.data[tooltipItem.index];
            let percentage = Math.floor(((currentValue/total) * 100)+0.5);
            return currentValue + " posts (" + percentage + "%)";
          },
          title: function(tooltipItem, data) {
            return data.labels[tooltipItem[0].index];
          }
        }
      }
    }
    return (
      <div>
        <h3>Posts by topic</h3>
        <Pie data={data} options={options}/>
      </div>
    )
  }

  getCommentsByChannelPieChart = () => {
    if (this.state.loading) {
      return (<Spinner loading={this.state.loading}/>)
    }
    
    let counts = this.state.stats.posts.by_channel;
    // looks like:
    // [{
    //   _id: { tags: ["test"] },
    //   post_count: 1,
    //   like_count: 2,
    //   comment_count: 3,
    // }, ...]
    counts = counts.slice().reverse(); // reverse array so that oldest channels are first

    let data = {
      labels: counts.map(a => {
        let tag_desc = a._id.tags.join(", ");
        return tag_desc;
      }),
      datasets: [{
        label: "comment_count",
        data: counts.map(a => a.comment_count),
        backgroundColor: backgroundColorPalette
      }]
    }
    let options = {
      tooltips: { // // show percentage https://stackoverflow.com/questions/37257034/chart-js-2-0-doughnut-tooltip-percentages
        callbacks: {
          label: function(tooltipItem, data) {
            let dataset = data.datasets[tooltipItem.datasetIndex];
            let total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
              return previousValue + currentValue;
            });
            let currentValue = dataset.data[tooltipItem.index];
            let percentage = Math.floor(((currentValue/total) * 100)+0.5);
            return currentValue + " comments (" + percentage + "%)";
          },
          title: function(tooltipItem, data) {
            return data.labels[tooltipItem[0].index];
          }
        }
      }
    }
    return (
      <div>
        <h3>Comments by topic</h3>
        <Pie data={data} options={options} />
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
        let role_desc = a._id.role;
        if (role_desc == undefined || role_desc == ''){
          return "<none>";
        } else{
          return role_desc.join(", ");
        }
      }),
      datasets: [{
        data: counts.map(a => a.count),
        backgroundColor: backgroundColorPalette
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

  getUserSubscriptionsByChannelPieChart = () => {
    if (this.state.loading) {
      return (<Spinner loading={this.state.loading}/>)
    }
    
    let counts = this.state.stats.users.subscriptions_by_channel;
    // looks like:
    // [{
    //   _id: { channel_name: "Test", channel_tags: ["Test"] },
    //   subscriber_count: 2
    // }, ...]
    counts = counts.slice().reverse(); // reverse array so that oldest channels are first

    let data = {
      labels: counts.map(a => a._id.channel_name),
      datasets: [{
        label: "subscriber_count",
        data: counts.map(a => a.subscriber_count),
        backgroundColor: backgroundColorPalette
      }]
    }
    let options = {
      tooltips: { // show percentage https://stackoverflow.com/questions/37257034/chart-js-2-0-doughnut-tooltip-percentages
        callbacks: {
          label: function(tooltipItem, data) {
            let dataset = data.datasets[tooltipItem.datasetIndex];
            let currentValue = dataset.data[tooltipItem.index];
            return currentValue + " subscribers";
          },
          title: function(tooltipItem, data) {
            return data.labels[tooltipItem[0].index];
          }
        }
      }
    }
    return (
      <div>
        <h3>User subscriptions by channel</h3>
        <Pie data={data} options={options}/>
      </div>
    )
  }

  getPostsAndCommentsByDayBarChart = () => {
    if (this.state.loading) {
      return (<Spinner loading={this.state.loading}/>)
    }

    // looks like:
    // [{
    //   date: Date(2019-12-31T00:00:00.000Z),
    //   post_count: 1,
    // }, ...]
    // should already be sorted in ascending order by date
    let post_counts = this.state.stats.posts.by_date;

    // looks like:
    // [{
    //   date: Date(2019-12-31T00:00:00.000Z),
    //   comment_count: 1,
    // }, ...]
    // should already be sorted in ascending order by date
    let comment_counts = this.state.stats.comments.by_date;

    let max_end_date = Math.max(
      moment.utc(post_counts[post_counts.length - 1].date),
      moment.utc(comment_counts[comment_counts.length - 1].date)
    );
    let end_date = moment.utc(max_end_date);

    let min_start_date = Math.min(
      moment.utc(post_counts[0].date),
      moment.utc(comment_counts[0].date),
      moment.utc(end_date).subtract(7, 'd') // pad dates if there aren't a lot of entries, to make the graph look nicer
    );    
    let cur_date = moment.utc(min_start_date);

    let labels = [];
    let post_count_series = [];
    let comment_count_series = [];

    for (let i = 0, j = 0; cur_date <= end_date; cur_date.add(24, 'h')) {
      labels.push(cur_date.format('YYYY-MM-DD'));

      if (i >= post_counts.length || cur_date < moment.utc(post_counts[i].date)) {
        post_count_series.push(0); // there is a gap in the post date counts, pad with 0
      } else {
        post_count_series.push(post_counts[i].post_count);
        i += 1;
      }

      if (j >= comment_counts.length || cur_date < moment.utc(comment_counts[j].date)) {
        comment_count_series.push(0); // there is a gap in the comment date counts, pad with 0
      } else {
        comment_count_series.push(comment_counts[j].comment_count);
        j += 1;
      }
    }

    let data = {
      labels: labels,
      datasets: [
        {
          label: 'Post count',
          backgroundColor: 'rgba(255,99,132)',
          data: post_count_series,
        },
        {
          label: 'Comment count',
          backgroundColor: 'rgba(255,212,99)',
          data: comment_count_series,
        }
      ]
    };

    let options = {
      scales: {
        xAxes: [{
          stacked: true,
          scaleLabel: {
            display: true,
            labelString: 'Date'
          }
        }],
        yAxes: [{
          stacked: true,
          scaleLabel: {
            display: true,
            labelString: 'Post and comment count'
          }
        }]
      }
    };

    return (
      <div>
        <h3>Posts and comments per day</h3>
        <div className="hint-text">Timestamps are in UTC</div>
        <Bar data={data} width={100} height={40} options={options} />
      </div>
    )
  }

  getTimeCardBubblePlot = () => {
    if (this.state.loading) {
      return (<Spinner loading={this.state.loading}/>)
    }

    // looks like:
    // [{
    //   _id: { dayOfWeek: 7, hour: 22 },
    //   post_count: 1,
    // }, ...]
    // should already be sorted in ascending order by dayOfWeek and then hour
    let post_counts = this.state.stats.posts.by_dayOfWeek_and_hour;

    // looks like:
    // [{
    //   _id: { dayOfWeek: 7, hour: 22 },
    //   comment_count: 1,
    // }, ...]
    // should already be sorted in ascending order by dayOfWeek and then hour
    let comment_counts = this.state.stats.comments.by_dayOfWeek_and_hour;

    // see: https://docs.mongodb.com/manual/reference/operator/aggregation/dayOfWeek/
    const days = {
      1: "Sunday",
      2: "Monday",
      3: "Tuesday",
      4: "Wednesday",
      5: "Thursday",
      6: "Friday",
      7: "Saturday"
    };

    let counts = {}; // counts[dayOfWeek][hour]

    for (let i = 1; i <= 7; i += 1) {
      counts[i] = {};
      for (let j = 0; j <= 23; j += 1) {
        counts[i][j] = 0;
      }
    }

    // bucket every 2 hours

    post_counts.forEach((a) => {
      let hour = Math.floor(a._id.hour/2)*2;
      counts[a._id.dayOfWeek][hour] += a.post_count;
    })

    comment_counts.forEach((a) => {
      let hour = Math.floor(a._id.hour/2)*2;
      counts[a._id.dayOfWeek][hour] += a.comment_count;
    })

    let max_r = 21; // arbitrary max r size for bubble
    let max_count = 1; // arbitrary starting value for max_count
    let data_series = [];

    // find the max count and rescale to prevent bubbles from being too big

    for (let i = 1; i <= 7; i += 1) {
      for (let j = 0; j <= 23; j += 1) {
        max_count = Math.max(counts[i][j], max_count);
      }
    }

    let scaling_factor = Math.min(max_r/max_count, 1); // scale down if too large, but avoid scaling up

    for (let i = 1; i <= 7; i += 1) {
      for (let j = 0; j <= 23; j += 1) {
        let r = counts[i][j];
        if (r > 0) {
          r = Math.max(1, r * scaling_factor); // make sure that non-zero bubbles are still selectable
        }
        data_series.push({
          x: j,
          y: days[i],
          r: r,
          value: counts[i][j]
        }) // flatten out data series into a format chart.js can handle
      }
    }

    const data = {
      yLabels: Object.values(days),
      datasets: [
        {
          label: 'Post and comment counts',
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.4)',
          data: data_series
        }
      ]
    };

    const options = {
      legend: false,
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            return tooltipItem.yLabel + " " + tooltipItem.xLabel + ":00 (" + value.value + ")";
          }
        }
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Hour'
          },
          ticks: {
            stepSize: 2, // bucket every 2 hours
            min: 0,
            max: 24
          },
        }],
        yAxes: [{
          type: 'category',
          scaleLabel: {
            display: true,
            labelString: 'Day of week'
          },
          ticks: {
            stepSize: 1,
            min: 'Sunday',
            max: 'Saturday'
          },
        }]
      }
    };

    return (
      <div>
        <h3>Time card for posts and comments</h3>
        <div className="hint-text">Timestamps are in UTC</div>
        <Bubble data={data} options={options} height={120}/>
      </div>
    )
  }

  // user counts as contributing if they made a post or comment on that day
  // fates for post likes aren't recorded in the database, so they can't be tracked in this way
  getContributingUsersByDayBarChart = () => {
    if (this.state.loading) {
      return (<Spinner loading={this.state.loading}/>)
    }

    // looks like:
    // [{
    //   date: Date(2019-12-31T00:00:00.000Z),
    //   contributing_user_count: 2,
    // }, ...]
    // should already be sorted in ascending order by date
    let contributing_users = this.state.stats.users.contributing_by_date;

    let end_date = moment.utc(contributing_users[contributing_users.length - 1].date);
    let min_start_date = Math.min(
      moment.utc(contributing_users[0].date),
      moment.utc(end_date).subtract(7, 'd') // pad dates if there aren't a lot of entries, to make the graph look nicer
    );    
    let cur_date = moment.utc(min_start_date);

    let labels = [];
    let data_series = [];

    for (let i = 0; cur_date <= end_date; cur_date.add(24, 'h')) {
      labels.push(cur_date.format('YYYY-MM-DD'));

      if (i >= contributing_users.length || cur_date < moment.utc(contributing_users[i].date)) {
        data_series.push(0); // there is a gap in the post date counts, pad with 0
      } else {
        data_series.push(contributing_users[i].contributing_user_count);
        i += 1;
      }
    }

    let data = {
      labels: labels,
      datasets: [
        {
          label: 'Contributing user count',
          backgroundColor: 'rgba(132,99,255)',
          fill: false,
          data: data_series,
        },
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
            labelString: 'Contributing user count'
          }
        }]
      }
    };

    return (
      <div>
        <h3>Unique contributing users per day</h3>
        <div className="hint-text">A user counts as contributing if they made a post or comment on that day</div>
        <Line data={data} width={100} height={40} options={options} />
      </div>
    )
  }
}

export default withRouter(Analytics);
