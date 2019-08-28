import React, { Component } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { Button } from '../Shared/Button';
import './Header.css';

class Header extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
       
    };
  }

  logout = () => {
    localStorage.removeItem('token');
    this.props.history.push('login');
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

        <div className="actions">
          {localStorage.getItem('token') ?
          <div className="links">
            {/*<NavLink className="navlink" activeClassName='navlink-active' to='/dashboard'>Dashboard</NavLink>*/}
            {/*<NavLink className="navlink" activeClassName='navlink-active' to='/analytics'>Analytics</NavLink>*/}
            <NavLink className="navlink" activeClassName='navlink-active' to='/channels'>Channels</NavLink>
            <NavLink className="navlink" activeClassName='navlink-active' to='/users'>Users</NavLink>
            <div onClick={this.logout} className="navlink">Log Out</div>
          </div>
          : null}
          {/*<Button onClick={() => {window.location = "http://skybunk.grebelife.com"}}>Go To App</Button>*/}
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
