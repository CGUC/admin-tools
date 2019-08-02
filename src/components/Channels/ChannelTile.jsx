import React, { Component } from 'react';
import { Input } from '../Shared/Input';
import { Action } from '../Shared/Button';
import DeleteChannelModal from './DeleteChannelModal';
import Controller from './ChannelsController'
import './Channels.css';

export default class ChannelTile extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      upForDelete: false,
      editing: false,
      name: this.props.channel.name,
      description: this.props.channel.description,
    }
  }

  async componentDidMount() {

  }

  handleClickEdit = () => {
    this.setState({
      editing: true,
      name: this.props.channel.name,
      description: this.props.channel.description
    })
  }

  handleCancelEdit = () => {
    this.setState({
      editing: false
    });
  }

  handleChange = (e, value) => {
      this.setState({
        [value]: e.target.value
      });
  }

  handleSave = (e) => {
    e.preventDefault();
    this.setState({
      editing: false
    })

    // TODO: Update endpoint in backend

    this.props.save(
      this.props.channel, {
        name: this.state.name,
        description: this.state.description
      }
    );
  }

  showDeleteModal = () => {
    this.setState({upForDelete: true})
  }

  confirmDelete = () => {
    this.props.onDelete(this.props.channel);
    this.cancelDelete();
  }

  cancelDelete = () => {
    this.setState({
      upForDelete: false
    })
  }

  render() {
    if (this.state.editing) {
      return (
        <div className="channel-card">
          <div className="title"> <Input width='100%' value={this.state.name} onChange={(e) => this.handleChange(e, 'name')}/></div>
          <div className="description"> <Input width='100%' value={this.state.description} onChange={(e) => this.handleChange(e, 'description')}/></div>
          <div className="tags">{this.props.channel.tags.join(', ')}</div>
          <div className="action-cell">
            <Action onClick={this.handleSave}>
              Save
            </Action>
            <Action onClick={this.handleCancelEdit}>
              Cancel
            </Action>
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="channel-card">
          <DeleteChannelModal show={this.state.upForDelete} channel={this.props.channel} cancel={this.cancelDelete} delete={this.confirmDelete}/>

          <div className="title">{this.props.channel.name}</div>
          <div className="description">{this.props.channel.description}</div>
          <div className="tags">{this.props.channel.tags.join(", ")}</div>
          <div className="action-cell">
            <Action onClick={this.handleClickEdit}>
              Edit
            </Action>
            <Action onClick={this.showDeleteModal}>
              Delete
            </Action>
          </div>
        </div>
      )
    }
  }
}
