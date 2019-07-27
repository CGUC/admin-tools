import React, { Component } from 'react';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { Card, CardHeader } from '../Shared/Card';
import { Button } from '../Shared/Button';
import Controller from './ChannelsController.js';
import './Channels.css';

class Channels extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      channels: []
    };
  }

  async componentDidMount() {
    const response = await Controller.getChannels(localStorage.getItem('token'));
    this.setState({channels: response});
  }

  getChannelList = () => {
    let channelList = [];

    this.state.channels.forEach((channel) => {
      channelList.push(
        <div className="channel-card" key={channel.name}>
          <div className="title">
            {channel.name}
          </div>
          <div className="description">
            {channel.description}
          </div>
          <Link to={`${channel._iid}/edit`} className="edit">
            Edit
          </Link>
        </div>
      )
    });

    return channelList;
  }

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

          <div className="channel-list">
            <div className="channel-card list-header">
              <div className="title">
                Title
              </div>
              <div className="title">
                Description
              </div>
            </div>

            {this.getChannelList()}
          </div>
        </Card>
      </div>
    );
  }
}

export default withRouter(Channels);
