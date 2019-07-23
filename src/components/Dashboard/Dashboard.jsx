import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Dashboard.css';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
       
    };
  }

  render() {
    return (
      <div>
        SKYBUNK ADMIN TOOLS DASHBOARD
      </div>
    );
  }
}

export default withRouter(Dashboard);
