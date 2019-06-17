import React, { Component } from "react";
import { Icon, Menu, Header } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

export default class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = { activeItem: 'profile', activeReviewItem: 'incoming' }
    this.address = this.props.address;
  }

  componentDidUpdate(props){
  }

  handleItemClick = async (e, { name }) => {
    this.setState({ activeItem: name })
  };

  handleReviewItemClick = async (e, { name }) => {
    this.setState({ activeReviewItem: name })
  };

  render() {
    const { activeItem, activeReviewItem } = this.state
    return (
      <div>
      <Menu icon='labeled' fixed='bottom' vertical>
        <Menu.Item name='profile' active={activeItem === 'profile'} onClick={this.handleItemClick}>
          <Icon name='user circle' />
          Profile
        </Menu.Item>

        <Menu.Item
          name='reviews'
          active={activeItem === 'reviews'}
          onClick={this.handleItemClick}
        >
          <Icon name='comment outline' />
          Reviews
        </Menu.Item>

        <Menu.Item
          name='acheivments'
          active={activeItem === 'acheivments'}
          onClick={this.handleItemClick}
        >
          <Icon name='trophy' />
          Acheivments
        </Menu.Item>
      </Menu>
      <div hidden={this.state.activeItem !== 'profile'}>
        <Header as='h1'>   Your Profile (Unnamed)</Header>
        <Header.Subheader>{this.address}</Header.Subheader>
      </div>
      <div hidden={this.state.activeItem !== 'reviews'}>
        <Header as='h1'> Business Reviews </Header>
        <Header.Subheader>{this.address}</Header.Subheader>
        <Menu widths={2} fluid>
          <Menu.Item 
            name='incoming' 
            active={activeReviewItem === 'incoming'} 
            onClick={this.handleReviewItemClick} />
          <Menu.Item
            name='outgoing'
            active={activeReviewItem === 'outgoing'}
            onClick={this.handleReviewItemClick}
          />
        </Menu>
        <div hidden={this.state.activeReviewItem !== 'incoming'}>
        </div>
        <div hidden={this.state.activeReviewItem !== 'outgoing'}>
        </div>
      </div>
      </div>
    )
  }
}