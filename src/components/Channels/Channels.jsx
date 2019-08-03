import React, { Component } from 'react';
import Fuse from 'fuse.js';
import { withRouter, Redirect, Link } from 'react-router-dom';
import Spinner from '../Shared/Loader';
import Modal from '../Shared/Modal';
import { Card, CardHeader } from '../Shared/Card';
import { InputGroup, Input, InputLabel } from '../Shared/Input';
import { Button } from '../Shared/Button';
import CreateChannelModal from './CreateChannelModal';
import ChannelTile from './ChannelTile';
import Controller from './ChannelsController';
import './Channels.css';

class Channels extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      channels: [],
      filteredChannels: [],
      showCreateModal: false,
      showDeleteModal: false,
      loading: true,
      channelToDelete: {}
    };
  }

  async componentDidMount() {
    const response = await Controller.getChannels(localStorage.getItem('token'));
    this.setState({
      loading: false,
      channels: response,
      filteredChannels: response
    });
  }

  deleteChannel = (channel) => {
    this.setState({
      channels: this.state.channels.filter(c => c._id !== channel._id), 
      filteredChannels: this.state.filteredChannels.filter(c => c._id !== channel._id)
    });
  }

  updateAfterCreate = (channel) => {
    this.setState({
      channels: [...this.state.channels, channel],
      filteredChannels: [...this.state.channels, channel],
      showCreateModal: false
    });
  }

  cancelCreate = () => {
    this.setState({
      showCreateModal: false
    })
  }

  filterChannels = (e) => {
    if (e.target.value === '') {
      this.setState({filteredChannels: this.state.channels});
      return;
    }

    const options = {
      keys: [{
        name: 'name',
        weight: 0.7,
      }, {
        name: 'description',
        weight: 0.1,
      }, {
        name: 'tags',
        weight: 0.2,
      }],
      threshold: 0.5,
    }
    const fuse = new Fuse(this.state.channels, options)
    this.setState({
      filteredChannels: fuse.search(e.target.value)
    });
  }

  saveChannel = (oldChannel, newChannel) => {
    this.setState({
      channels: this.state.channels.map(c => 
        c._id === oldChannel._id ? {...c, ...newChannel} : c
      ),
      filteredChannels: this.state.filteredChannels.map(c => 
        c._id === oldChannel._id ? {...c, ...newChannel} : c
      )
    })
  }

  getChannelList = () => {
    let channelList = [];

    this.state.filteredChannels.forEach((channel) => {
      channelList.push(
        <ChannelTile channel={channel} onDelete={this.deleteChannel} save={this.saveChannel} key={channel._id}/>
      )
    });

    return channelList;
  }

  render() {
    return !localStorage.getItem('token') ? <Redirect to='/login'/> :
    (
      <div className='channels'>
        <CreateChannelModal show={this.state.showCreateModal} update={this.updateAfterCreate} cancel={this.cancelCreate}/>

        <Card>
          <CardHeader>
            Channel List
          </CardHeader>

          <InputLabel>Search</InputLabel>
          <Input onChange={this.filterChannels}/>

          <div className="channel-list">
            <div className="channel-card list-header">
              <div className="title">
                Title
              </div>
              <div className="description">
                Description
              </div>
              <div className="tags">
                Tags
              </div>
              <div className="tags"/>
            </div>
            <Spinner loading={this.state.loading}/>
            {this.getChannelList()}
          </div>
          
          <Button primary width='150px' onClick={() => this.setState({showCreateModal:true})}>Create</Button>
        </Card>
      </div>
    );
  }
}

export default withRouter(Channels);
