import React, { Component } from 'react';
import Spinner from '../Shared/Loader';
import Modal from '../Shared/Modal';
import { InputGroup, Input, InputLabel } from '../Shared/Input';
import { Button } from '../Shared/Button';
import Controller from './UsersController.js';

export default class DeleteUserModal extends Component {

  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      deleteConfirmation: '',
      error: ''
    };
  }

  handleDeleteUser = (e) => {
    e.preventDefault();

    if (this.state.deleteConfirmation != this.props.user.username) {
      this.setState({
        error: 'Inputted username does not match username'
      })
      return;
    }

    // TODO: delete channel endpoint on server
    // this.setState({loading: true});
    // const response = await Controller.deleteChannel(localStorage.getItem('token'), newChannel);
    // this.setState({loading: false});
  
    // if (response.status != 200) {
    //   this.setState({error: 'There was an error creating the channel. Please try again.'})
    // }
    // else {
      this.props.delete();
    // }
  }

	render() {
		return (
		  <Modal show={this.props.show} title={`Delete '${this.props.user.username}'`} width="500px">
		    <form onSubmit={this.handleDeleteUser}>
          <InputGroup>
  		      <InputLabel>
  		        {`Type '${this.props.user.username}'`}
  		      </InputLabel>
  		      <Input 
  		        placeholder="Please type the username of the user to confirm deletion"
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