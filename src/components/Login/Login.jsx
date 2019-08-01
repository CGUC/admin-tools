import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Spinner from '../Shared/Loader';
import { CardDescription, CardHeader, Card } from '../Shared/Card';
import { Input, InputLabel } from '../Shared/Input';
import { Button } from '../Shared/Button';
import Controller from './LoginController';
import './Login.css';

class Login extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      loading: false,
      username: '',
      password: '',
      error: ''
    };
  }

  handleLogin = async (e) => {
    e.preventDefault();

    this.setState({loading: true, error: ''});
    const response = await Controller.tryLogin(this.state.username, this.state.password);
    this.setState({loading: false});

    if (response.err) {
      this.setState({error: response.err.message});
    } else {
      // This is safe since react protects against XSS.
      // As long as we don't use a CDN it should be fine.
      localStorage.setItem('token', response.token);
      this.props.history.push('/dashboard');
    }
  };

  handleUsernameChange = (e) => {
    this.setState({username: e.target.value});
    e.preventDefault();
  }

  handlePasswordChange = (e) => {
    this.setState({password: e.target.value});
    e.preventDefault();
  }

  render() {
    return (
      <div className="login">
        <Card width='420px' marginBottom='80px'>
          <CardHeader>
            Login
          </CardHeader>
          <CardDescription>
            You must have admin privileges in order to log in.
          </CardDescription>

          <form onSubmit={this.handleLogin}>
            <InputLabel>
              Username
            </InputLabel>
            <Input placeholder="conrad123" value={this.state.username} onChange={this.handleUsernameChange} required/>

            <InputLabel>
              Password
            </InputLabel>
            <Input type='password' placeholder="********" value={this.state.password} onChange={this.handlePasswordChange} required/>
            
            <div className="error-message">
              <Spinner loading={this.state.loading}/>
              {this.state.error}
            </div>
            <Button primary margin='auto'>
              Login
            </Button>
          </form>
        </Card>

      </div>
    );
  }
}

export default withRouter(Login);
