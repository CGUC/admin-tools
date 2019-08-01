import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import Spinner from '../Shared/Loader';
import { Card, CardHeader } from '../Shared/Card';
import { Input, InputLabel } from '../Shared/Input';
import { Action, Button } from '../Shared/Button';
import Controller from './UsersController'
import './Users.css';

class Users extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      editing: {},
      users: []
    }
  }

  async componentDidMount() {
    const response = await Controller.getUsers(localStorage.getItem('token'));
    this.setState({
      loading: false,
      users: response
    });
  }

  handleClickEdit = (user) => {
    this.setState({
      editing: {...this.state.editing, [user._id]: {...user}}
    })
  }

  handleCancelEdit = (user) => {
    const tmp = this.state.editing
    delete tmp[user._id]
    this.setState({editing: tmp});
  }

  handleChange = (e, user, value) => {
    const newUser = this.state.editing[user._id];
    if (value === 'role')
      newUser.role = e.target.value.split(", ");
    else
      newUser[value] = e.target.value;
    this.setState({
      editing: {...this.state.editing, [user._id]: newUser}
    });
  }

  handleSave = (e) => {
    e.preventDefault();

    
  }

  getUserList = () => {
    let userList = [];

    this.state.users.forEach((user) => {
      if (user._id in this.state.editing) {
        userList.push(
          <div className="user-card" key={user._id}>
            <div className="cell"> <Input width='100%' value={this.state.editing[user._id].firstName} onChange={(e) => this.handleChange(e, user, 'firstName')}/></div>
            <div className="cell"> <Input width='100%' value={this.state.editing[user._id].lastName} onChange={(e) => this.handleChange(e, user, 'lastName')}/></div>
            <div className="cell">{user.username}</div>
            <div className="cell"> <Input width='100%' value={this.state.editing[user._id].role.join(', ')} onChange={(e) => this.handleChange(e, user, 'role')}/></div>
            <div className="action-cell">
              <Action>
                Save
              </Action>
              <Action onClick={() => this.handleCancelEdit(user)}>
                Cancel
              </Action>
            </div>
          </div>
        )
      }
      else {
        userList.push(
          <div className="user-card" key={user.username}>
            <div className="cell">{user.firstName}</div>
            <div className="cell">{user.lastName}</div>
            <div className="cell">{user.username}</div>
            <div className="cell">{user.role.join(', ')}</div>
            <div className="action-cell">
              <Action onClick={() => this.handleClickEdit(user)}>
                Edit
              </Action>
              <Action>
                Delete
              </Action>
            </div>
          </div>
        )
      }
    });

    return userList;
  }

  render() {
    return !localStorage.getItem('token') ? <Redirect to='/login'/> :
    (
      <div className='users'>
        <Card>
          <CardHeader>
            User List
          </CardHeader>

          <InputLabel>Search</InputLabel>
          <Input/>

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

          <Button primary width='150px'>Create</Button>
        </Card>

      </div>
    );
  }
}

export default withRouter(Users);
