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

  handleDeleteUser = async (e) => {
    e.preventDefault();

    if (this.state.deleteConfirmation != this.props.user.username) {
      this.setState({
        error: 'Inputted username does not match username'
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