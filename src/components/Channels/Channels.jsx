import React, { Component } from 'react';
import Fuse from 'fuse.js';
import { withRouter, Redirect, Link } from 'react-router-dom';
import Spinner from '../Shared/Loader';
import Modal from '../Shared/Modal';
import { Card, CardHeader } from '../Shared/Card';
import { InputGroup, Input, InputLabel } from '../Shared/Input';
import { Button } from '../Shared/Button';
import CreateChannelModal from './CreateChannelModal';
import DeleteChannelModal from './DeleteChannelModal';
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

  setChannelForDeletion = (channel) => {
    this.setState({
      channelToDelete: channel,
      showDeleteModal: true
    })
  }

  cancelDelete = () => {
    this.setState({
      channelToDelete: {},
      showDeleteModal: false
    })
  }

  confirmDelete = () => {
    this.setState({
      channels: this.state.channels.filter(c => c._id !== this.state.channelToDelete._id), 
      filteredChannels: this.state.filteredChannels.filter(c => c._id !== this.state.channelToDelete._id)
    });
    this.cancelDelete();
  }

  updateAfterCreate = (channel) => {
    this.setState({
      channels: [...this.state.channels, channel],
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

  getChannelList = () => {
    let channelList = [];

    this.state.filteredChannels.forEach((channel) => {
      channelList.push(
        <div className="channel-card" key={channel.name}>
          <div className="title">
            {channel.name}
          </div>
          <div className="description">
            {channel.description}
          </div>
          <div className="title">
            {channel.tags.join(", ")}
          </div>
          <div className="action-cell">
            <div className="action">
              Edit
            </div>
            <div className="action" onClick={() => {this.setChannelForDeletion(channel)}}>
              Delete
            </div>
          </div>
        </div>
      )
    });

    return channelList;
  }

  render() {
    return !localStorage.getItem('token') ? <Redirect to='/login'/> :
    (
      <div className='channels'>
        <CreateChannelModal show={this.state.showCreateModal} update={this.updateAfterCreate} cancel={this.cancelCreate}/>
        <DeleteChannelModal show={this.state.showDeleteModal} channel={this.state.channelToDelete} cancel={this.cancelDelete} delete={this.confirmDelete}/>

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
              <div className="title">
                Tags
              </div>
              <div className="action-cell"/>
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
