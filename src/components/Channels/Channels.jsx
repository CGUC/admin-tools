import React, { Component } from 'react';
import { withRouter, Redirect, Link } from 'react-router-dom';
import Spinner from '../Shared/Loader';
import Modal from '../Shared/Modal';
import { Card, CardHeader } from '../Shared/Card';
import { InputGroup, Input, InputLabel } from '../Shared/Input';
import { Button } from '../Shared/Button';
import Controller from './ChannelsController.js';
import './Channels.css';

class Channels extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      channels: [],
      createChannel: false,
      loading: true,
      loadingCreate: false,
      newChannel: {
        name:'',
        description:'',
        tag:''
      }
    };
  }

  async componentDidMount() {
    const response = await Controller.getChannels(localStorage.getItem('token'));
    this.setState({
      loading: false,
      channels: response
    });
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
          <div className="title">
            {channel.tags.join(", ")}
          </div>
          <div className="action-cell">
            <div className="action">
              Edit
            </div>
            <div className="action">
              Delete
            </div>
          </div>
        </div>
      )
    });

    return channelList;
  }

  handleCreateChange = (e, val) => {
    const updatedChannel = this.state.newChannel;
    updatedChannel[val] = e.target.value;

    this.setState({newChannel: updatedChannel});
  }

  handleCreatechannel = async (e) => {
    e.preventDefault();
    this.setState({
      loadingCreate: true,
      createError: '',
    })
    const newChannel = {
      name: this.state.newChannel.name,
      description: this.state.newChannel.description,
      tags: [this.state.newChannel.tag]
    }
    const response = await Controller.createChannel(localStorage.getItem('token'), newChannel);
    this.setState({loadingCreate: false});

    if (response.status != 200) {
      this.setState({createError: 'There was an error creating the channel. Please try again.'})
    }
    else {
      this.handleCancelCreate();
      this.setState({channels: [...this.state.channels, response.data]})
    }
  }

  handleCancelCreate = () => {
    this.setState({
      createChannel: false,
      newChannel: {
        name:'',
        description:'',
        tag:''
      }
    })
  }

  createChannelModal = () => {
    return (
      <Modal show={this.state.createChannel} title="Create Channel" width="500px">
        <form onSubmit={this.handleCreatechannel}>
          <InputGroup>
            <InputLabel>
              Name
            </InputLabel>
            <Input 
              placeholder="How users will see the channel"
              value={this.state.newChannel.name} 
              onChange={e => {this.handleCreateChange(e, 'name')}}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputLabel>
              Description
            </InputLabel>
            <Input 
              placeholder="A brief description of the channel"
              onChange={e => {this.handleCreateChange(e, 'description')}}
              value={this.state.newChannel.description}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <InputLabel>
              Tag
            </InputLabel>
            <Input
              placeholder="Posts made the the corresponding tag will appear under this channel"
              value={this.state.newChannel.tag}
              onChange={e => {this.handleCreateChange(e, 'tag')}}
              required
            />
          </InputGroup>
          <div>
            {this.state.createError}
            <Spinner loading={this.state.loadingCreate}/>
          </div>
          <div>
            <Button primary>Submit</Button>
            <Button type="reset" onClick={this.handleCancelCreate}>Cancel</Button>
          </div>
        </form>
      </Modal>
    )
  }

  render() {
    return !localStorage.getItem('token') ? <Redirect to='/login'/> :
    (
      <div className='channels'>
        {this.createChannelModal()}
        
        <Card>
          <CardHeader>
            Channel List
          </CardHeader>

          <InputLabel>Search</InputLabel>
          <Input/>

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
          
          <Button primary width='150px' onClick={() => this.setState({createChannel:true})}>Create</Button>
        </Card>
      </div>
    );
  }
}

export default withRouter(Channels);
