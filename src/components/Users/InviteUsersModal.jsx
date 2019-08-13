import React, { Component } from 'react';
import Papa from 'papaparse'
import Spinner from '../Shared/Loader';
import Modal from '../Shared/Modal';
import { InputGroupRow, Input } from '../Shared/Input';
import { Action, Button } from '../Shared/Button';
import Controller from './UsersController.js';

export default class InviteUsersModal extends Component {

  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      usersToInvite: [{name: '', email: ''}],
      error: ''
    };
  }

  handleInviteUsers = async (e) => {
    e.preventDefault();

    this.setState({
      loading: true,
      error: ''
    });
    const response = await Controller.inviteUsers(localStorage.getItem('token'), this.state.usersToInvite);
    this.setState({loading:false});

    if (response.status == 200) {
      this.setState({
        usersToInvite: this.state.usersToInvite.filter(u => response.data.errors.filter(e => u.email === e.user).length),
      });
      this.props.onConfirm(response.data);
    } else {
      this.setState({
        error: 'There was an error processing your request. Please try again.'
      });
    }

  }

  handleEmailChange = (e, i) => {
    const oldUsers = this.state.usersToInvite;
    oldUsers[i] = {
      email: e.target.value,
      name: oldUsers[i].name
    } 
    this.setState({
      usersToInvite: oldUsers
    })
  }

  handleNameChange = (e, i) => {
    const oldUsers = this.state.usersToInvite;
    oldUsers[i] = {
      email: oldUsers[i].email,
      name: e.target.value
    };
    this.setState({
      usersToInvite: oldUsers
    })
  }

  handleRemoveUser = (e, i) => {
    e.preventDefault()
    const oldUsers = this.state.usersToInvite;
    oldUsers.splice(i, 1);
    this.setState({
      usersToInvite: oldUsers
    })
  } 

  addEmptyUser = (e) => {
    e.preventDefault();
    this.setState({
      usersToInvite: [...this.state.usersToInvite, {name: '', email: ''}]
    });
  }

  handleCancel = () => {
    this.setState({
      usersToInvite: [{name: '', email: ''}],
    });
    this.props.cancel();
  }

  handleCSV = (e) => {
    this.setState({loading:true})
    Papa.parse(e.target.files[0], {
      complete: (results) => {
        this.setState({
          usersToInvite: [
            ...this.state.usersToInvite.filter(e => e.name && e.email),
            ...results.data.map(u => ({
              name: u[0],
              email: u[1]
            })).filter(e => e.name && e.email)
          ],
          loading: false
        });
      }
    });
    e.target.value = null;
  }

  inviteUserList = () => {
    const userList = [];

    this.state.usersToInvite.forEach((user, i) => {
      userList.push(
        <InputGroupRow key={i}>
          <div style={{width:'20px'}}>{i+1}.</div>
          <Input width='49%' placeholder='Email Address' value={this.state.usersToInvite[i].email} onChange={e => {this.handleEmailChange(e, i)}} required/>
          <Input width='49%' placeholder='Name' value={this.state.usersToInvite[i].name} onChange={e => {this.handleNameChange(e, i)}} required/>
          <Action onClick={e => {this.handleRemoveUser(e, i)}}>x</Action>
        </InputGroupRow>
      )
    });

    return (
      <div style={{marginBottom:'10px', marginTop: '20px'}}>
        <div style={{marginBottom:'10px', maxHeight: '60vh', overflow: 'auto'}}>
          {userList}
        </div>
        <Action onClick={this.addEmptyUser}>Add</Action>
      </div>
    )
  }

	render() {
		return (
		  <Modal show={this.props.show} title={`Invite Users`} width="80%">
		    <form onSubmit={this.handleInviteUsers}>
          <div style={{marginBottom: '20px'}}>
            Input the email address and name of the users you would like to invite. 
            An email will be sent containing a golden ticket for them to register.
            The name will only be used to address the user in the email.</div>
          <div className='hidden-input-wrapper'>
            <Button primary>Import from CSV</Button>
            <input type='file' accept='.csv' onChange={this.handleCSV}/>
          </div>
          {this.inviteUserList()}
          <div>
            {this.state.error}
            <Spinner loading={this.state.loading}/>
          </div>
  		    <div>
  		      <Button primary>Confirm</Button>
  		      <Button type="reset" onClick={this.handleCancel}>Cancel</Button>
  		    </div>
        </form>
		  </Modal>
		)
	}
}