import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Login.css';

class Login extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
       
    };
  }

  render() {
    return (
      <div>
        SKYBUNK ADMIN TOOLS LOGIN
      </div>
    );
  }
}

export default withRouter(Login);
