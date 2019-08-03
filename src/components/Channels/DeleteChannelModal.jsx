import React, { Component } from 'react';
import Spinner from '../Shared/Loader';
import Modal from '../Shared/Modal';
import { InputGroup, Input, InputLabel } from '../Shared/Input';
import { Button } from '../Shared/Button';
import Controller from './ChannelsController.js';

export default class DeleteChannelModal extends Component {

  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      deleteConfirmation: '',
      error: ''
    };
  }

  handleDeleteChannel = async (e) => {
    e.preventDefault();

    if (this.state.deleteConfirmation != this.props.channel.name) {
      this.setState({
        error: 'Inputted name does not match channel name'
      })
      return;
    }

    this.setState({loading: true});
    try {
      await this.props.delete();
    } catch (e) {
      this.setState({loading: false});
      this.setState({error: e.message});
    }
  }

	render() {
		return (
		  <Modal show={this.props.show} title={`Delete '${this.props.channel.name}'`} width="500px">
		    <form onSubmit={this.handleDeleteChannel}>
          <InputGroup>
  		      <InputLabel>
  		        {`Type '${this.props.channel.name}'`}
  		      </InputLabel>
  		      <Input 
  		        placeholder="Please type the name of the channel to confirm deletion"
  		        value={this.state.deleteConfirmation} 
  		        onChange={e => {this.setState({deleteConfirmation:e.target.value})}}
  		        required
  		      />
  		    </InputGroup>
          <div>
            {this.state.error}
            <Spinner loading={this.state.loading}/>
          </div>
  		    <div>
  		      <Button primary>Confirm</Button>
  		      <Button type="reset" onClick={this.props.cancel}>Cancel</Button>
  		    </div>
        </form>
		  </Modal>
		)
	}
}