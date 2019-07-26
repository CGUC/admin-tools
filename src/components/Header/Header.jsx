import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Header.css';

class Header extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
       
    };
  }

  render() {
    return (
      <div className="header">
        <div className="title-container">
          <div className="title">
            Skybunk
          </div>
          <div className="subtitle">
            admin console
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
