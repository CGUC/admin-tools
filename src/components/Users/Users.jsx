import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import Fuse from 'fuse.js';
import Spinner from '../Shared/Loader';
import { Card, CardHeader } from '../Shared/Card';
import { Input, InputLabel } from '../Shared/Input';
import { Action, Button } from '../Shared/Button';
import Modal from '../Shared/Modal';
import InviteUsersModal from './InviteUsersModal';
import InviteSummaryModal from './InviteSummaryModal';
import UserTile from './UserTile';
import Controller from './UsersController';
import './Users.css';

class Users extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      users: [],
      filteredUsers: [],
      showInviteModal: false,
      showInviteModal: false,
      inviteData: {
        errors: [],
        successes: 0
      }
    }
  }

  async componentDidMount() {
    const response = await Controller.getUsers(localStorage.getItem('token'));
    this.setState({
      loading: false,
      users: response,
      filteredUsers: response
    });
  }

  deleteUser = (user) => {
    this.setState({
      users: this.state.users.filter(u => u._id !== user._id), 
      filteredUsers: this.state.filteredUsers.filter(u => u._id !== user._id)
    });
  }

  saveUser = (oldUser, newUser) => {
    this.setState({
      users: this.state.users.map(u => 
        u._id === oldUser._id ? {...u, ...newUser} : u
      ),
      filteredUsers: this.state.filteredUsers.map(u => 
        u._id === oldUser._id ? {...u, ...newUser} : u
      )
    })
  }

  handleInvite = () => {
    this.setState({
      showInviteModal: true
    })
  }

  cancelInvite = () => {
    this.setState({
      showInviteModal: false
    })
  }

  handleConfirmInvites = (data) => {
    this.setState({
      inviteData: data,
      showSummaryModal: true,
    })

    if(!data.errors.length) {
      this.setState({
        showInviteModal: false,
      });
    }
  }

  closeSummary = () => {
    this.setState({
      showSummaryModal: false
    });
  }

  filterUsers = (e) => {
    if (e.target.value === '') {
      this.setState({filteredUsers: this.state.users});
      return;
    }

    const options = {
      keys: [{
        name: 'firstName',
        weight: 0.3,
      }, {
        name: 'lastName',
        weight: 0.3,
      }, {
        name: 'username',
        weight: 0.2,
      }, {
        name: 'role',
        weight: 0.1
      }],
      threshold: 0.5,
    }
    const fuse = new Fuse(this.state.users, options)
    this.setState({
      filteredUsers: fuse.search(e.target.value)
    });
  }

  getUserList = () => {
    let userList = [];

    this.state.filteredUsers.forEach((user) => {
      userList.push(
        <UserTile user={user} onDelete={this.deleteUser} save={this.saveUser} key={user._id}/>
      )
    });

    return userList;
  }

  render() {
    return !localStorage.getItem('token') ? <Redirect to='/login'/> :
    (
      <div className='users'>
        <InviteUsersModal show={this.state.showInviteModal} update={this.updateAfterInvite} cancel={this.cancelInvite} onConfirm={this.handleConfirmInvites}/>        
        <InviteSummaryModal show={this.state.showSummaryModal} close={this.closeSummary} data={this.state.inviteData}/>
        <Card>
          <CardHeader>
            User List
          </CardHeader>
          
          <Button primary width='150px' style={{marginBottom:'10px'}} onClick={this.handleInvite}>Invite</Button>

          <InputLabel>Search</InputLabel>
          <Input onChange={this.filterUsers}/>

          <div className="user-list">
            <div className="user-card list-header">
              <div className="cell">
                First Name
              </div>
              <div className="cell">
                Last Name
              </div>
              <div className="cell">
                Username
              </div>
              <div className="cell">
                Roles
              </div>
              <div className="cell"/>
              <div className="edit"/>
            </div>
            <Spinner loading={this.state.loading}/>
            {this.getUserList()}
          </div>

          <Button primary width='150px' onClick={this.handleInvite}>Invite</Button>
        </Card>

      </div>
    );
  }
}

export default withRouter(Users);
