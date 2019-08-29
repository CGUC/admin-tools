import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Spinner from '../Shared/Loader';
import { CardDescription, CardHeader, Card } from '../Shared/Card';
import { InputGroup, Input, InputLabel } from '../Shared/Input';
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

    if (response.status !== 200) {
      this.setState({error: response.data.err.message});
    } else if (response.data.err) {
      this.setState({error: response.data.err.message});
    } else {
      // This is safe since react protects against XSS.
      // As long as we don't use a CDN it should be fine.
      localStorage.setItem('token', response.data[0].token);
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
            <InputGroup>
              <InputLabel>
                Username
              </InputLabel>
              <Input placeholder="conrad123" value={this.state.username} onChange={this.handleUsernameChange} required/>
            </InputGroup>

            <InputGroup>
              <InputLabel>
                Password
              </InputLabel>
              <Input type='password' placeholder="********" value={this.state.password} onChange={this.handlePasswordChange} required/>
            </InputGroup>
            
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
