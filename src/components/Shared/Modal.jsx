import React, { Component } from 'react';
import { Card, CardHeader } from '../Shared/Card'; 
import styled from 'styled-components'

const Backdrop = styled.div`
  display: ${props => props.show ? "flex" : "none"};
  z-index: 1;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`

export default class Modal extends Component {
  render() {
    return (
      <Backdrop show={this.props.show}>
        <Card margin='auto' width={this.props.width}>
          <CardHeader>{this.props.title}</CardHeader>
          {this.props.children}
        </Card>
      </Backdrop>
    );
  }
}
