import React, { Component } from 'react';
import { Input } from '../Shared/Input';
import { Action } from '../Shared/Button';
import DeleteUserModal from './DeleteUserModal';
import Controller from './UsersController'
import './Users.css';

export default class UserTile extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      upForDelete: false,
      firstName: this.props.user.firstName,
      lastName: this.props.user.lastName,
      username: this.props.user.username,
      role: this.props.user.role
    }
  }

  handleClickEdit = () => {
    this.setState({
      editing: true,
      firstName: this.props.user.firstName,
      lastName: this.props.user.lastName,
      role: this.props.user.role
    })
  }

  handleCancelEdit = () => {
    this.setState({
      editing: false
    });
  }

  handleChange = (e, value) => {
      this.setState({
        [value]: value === 'role' ? e.target.value.split(', ') : e.target.value
      });
  }

  handleSave = async (e) => {
    e.preventDefault();
    const response = await Controller.updateUser(
      localStorage.getItem('token'),
      this.props.user._id,
      {...this.props.user,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        role: this.state.role
      }
    );

    if (response.status == 403) {
      this.setState({
        error: 'You do not have permission to udpate this user'
      });
    } else if (response.status !== 200) {
      this.setState({
        error: 'There was an error updating the user.'
      });
    } else {
      this.setState({
        editing: false
      });
      this.props.save(
        this.props.user, {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          username: this.state.username,
          role: this.state.role
        }
      );
    }
  }

  showDeleteModal = () => {
    this.setState({upForDelete: true})
  }

  confirmDelete = async () => {
    const response = await Controller.deleteUser(localStorage.getItem('token'), this.props.user._id);
    if (response.status != 200) {
      throw new Error('There was an error deleting the user. Please try again.');
    } else {
      this.props.onDelete(this.props.user);
      this.cancelDelete();
    }
  }

  cancelDelete = () => {
    this.setState({
      upForDelete: false
    })
  }

  render() {
    if (this.state.editing) {
      return (
        <div className="user-card" key={this.props.user._id}>
          <div className="cell"> <Input width='100%' value={this.state.firstName} onChange={(e) => this.handleChange(e, 'firstName')}/></div>
          <div className="cell"> <Input width='100%' value={this.state.lastName} onChange={(e) => this.handleChange(e, 'lastName')}/></div>
          <div className="cell">{this.props.user.username}</div>
          <div className="cell"> <Input width='100%' value={this.state.role.join(', ')} onChange={(e) => this.handleChange(e, 'role')}/></div>
          <div className="action-cell">
            <Action  onClick={this.handleSave}>
              Save
            </Action>
            <Action onClick={this.handleCancelEdit}>
              Cancel
            </Action>
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="user-card" key={this.props.user.username}>
          <DeleteUserModal show={this.state.upForDelete} user={this.props.user} cancel={this.cancelDelete} delete={this.confirmDelete}/>

          <div className="cell">{this.props.user.firstName}</div>
          <div className="cell">{this.props.user.lastName}</div>
          <div className="cell">{this.props.user.username}</div>
          <div className="cell">{this.props.user.role.join(', ')}</div>
          <div className="action-cell">
            <Action onClick={this.handleClickEdit}>
              Edit
            </Action>
            <Action onClick={this.showDeleteModal}>
              Delete
            </Action>
          </div>
        </div>
      )
    }
  }
}
