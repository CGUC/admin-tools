import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { CardDescription, CardHeader, Card } from '../Shared/Card';
import { Input, InputLabel } from '../Shared/Input';
import { Button } from '../Shared/Button';
import './Login.css';

class Login extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
       
    };
  }

  handleLogin = (e) => {
    
    // TODO: Actual login logic.
    this.props.history.push('/dashboard');

    // This is safe since react protects against XSS.
    // As long as we don't use a CDN it should be fine.
    localStorage.setItem('token', 'theirusertoken');

    e.preventDefault();
  };

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
            <Input placeholder="conrad123" />

            <InputLabel>
              Password
            </InputLabel>
            <Input type='password' placeholder="********"/>
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
