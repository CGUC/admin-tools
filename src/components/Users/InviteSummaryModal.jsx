import React, { Component } from 'react';
import Modal from '../Shared/Modal';
import { Button } from '../Shared/Button';

export default class InviteSummaryModal extends Component {
	
  showErrors = () => {
    if (!this.props.data.errors.length) return null;

    const failedUsers = [];
    this.props.data.errors.forEach((e, i) => {
      failedUsers.push(<div key={i}>{e.user}</div>);
    });

    return (
      <div style={{marginBottom:'10px'}}>
        <div style={{color:'red'}}>Emails failed to send to the following users:</div>
        {failedUsers}
      </div>
    )
  }

  render () {
		return (
			<Modal show={this.props.show}>
			  <div style={{marginBottom:'10px'}}>Successfully sent emails to {this.props.data.successes} user(s).</div>
        {this.showErrors()}
			  <Button primary onClick={this.props.close}>Ok</Button>
			</Modal>
		)
	}
}