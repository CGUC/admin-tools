import React, { Component } from 'react';
import { withRouter, Redirect, Link } from 'react-router-dom';
import Spinner from '../Shared/Loader';
import { Card, CardHeader } from '../Shared/Card';
import { Input, InputLabel } from '../Shared/Input';
import { Button } from '../Shared/Button';
import Controller from './UsersController'
import './Users.css';

class Users extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
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

  getUserList = () => {
    let userList = [];

    this.state.users.forEach((user) => {
      userList.push(
        <div className="user-card" key={user.username}>
          <div className="cell">{user.firstName}</div>
          <div className="cell">{user.lastName}</div>
          <div className="cell">{user.username}</div>
          <div className="cell">{user.role}</div>
          <div className="cell"/>
          <Link to={`${user._iid}/edit`} className="edit">
            Edit
          </Link>
        </div>
      )
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

          <div style={{marginBottom: '20px'}}>
            <Button primary width='150px'>Create</Button>
            <Button width='150px'>Delete</Button>
          </div>

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
        </Card>

      </div>
    );
  }
}

export default withRouter(Users);
