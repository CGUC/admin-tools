import React, { Component } from 'react';
import Spinner from '../Shared/Loader';
import Modal from '../Shared/Modal';
import { InputGroup, Input, InputLabel } from '../Shared/Input';
import { Button } from '../Shared/Button';
import Controller from './ChannelsController.js';

export default class CreateChannelModal extends Component {

  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      newChannel: {
        name:'',
        description:'',
        tag:''
      },
      error: ''
    };
  }

  handleCreatechannel = async (e) => {
    e.preventDefault();
    this.setState({
      loading: true,
      error: '',
    })
    const newChannel = {
      name: this.state.newChannel.name,
      description: this.state.newChannel.description,
      tags: [this.state.newChannel.tag]
    }
    const response = await Controller.createChannel(localStorage.getItem('token'), newChannel);
    this.setState({loading: false});

    if (response.status != 200) {
      this.setState({error: 'There was an error creating the channel. Please try again.'})
    }
    else {
      this.handleCancelCreate();
      this.props.update(response.data);
    }
  }

  handleCancelCreate = () => {
    this.props.cancel();
    this.setState({
      newChannel: {
        name:'',
        description:'',
        tag:''
      }
    })
  }

  handleCreateChange = (e, val) => {
    const updatedChannel = this.state.newChannel;
    updatedChannel[val] = e.target.value;

    this.setState({newChannel: updatedChannel});
  }

	render() {
		return (
		  <Modal show={this.props.show} title="Create Channel" width="500px">
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
		        {this.state.error}
		        <Spinner loading={this.state.loading}/>
		      </div>
		      <div>
		        <Button primary>Submit</Button>
		        <Button type="reset" onClick={this.handleCancelCreate}>Cancel</Button>
		      </div>
		    </form>
		  </Modal>
		)
	}
}