import React, { Component } from "react";
import { Icon, Menu, Header } from 'semantic-ui-react'
import CompletedReviewList from './CompletedReviewList'
import 'semantic-ui-css/semantic.min.css'

export default class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      activeItem: 'profile', 
      activeReviewItem: 'incoming',
      completedIncomingReviews: [],
      completedIncomingReviews: []
      }
    this.address = this.props.address;
    this.boomerang = this.props.boomerang;
  }

  handleItemClick = async (e, { name }) => {
    this.setState({ activeItem: name })
    if (name === 'reviews') {
      this.getCompletedReviews();
    }
  };

  handleReviewItemClick = async (e, { name }) => {
    this.setState({ activeReviewItem: name })
  };

  getCompletedReviews = async () => {
    let completedIncomingReviews = []
    let completedOutgoingReviews = []
    await this.boomerang.getPastEvents('ReviewCompleted', {
      fromBlock: 0,
      toBlock: 'latest'
    }, async (err, events) => {
      for (var i=0; i<events.length;i++) {
        if (events[i].returnValues.business === this.props.address) {
          completedIncomingReviews.push(events[i]);
        } else if (events[i].returnValues.customer === this.props.address) {
          completedOutgoingReviews.push(events[i]);
        }
      }
      this.setState({
        completedIncomingReviews: completedIncomingReviews.reverse(), 
        completedOutgoingReviews: completedOutgoingReviews.reverse() 
      });
      this.calculatePositivePercent(completedIncomingReviews);
    });
  }

  calculatePositivePercent = async (completedIncomingReviews) => {
    var numPositive = 0;
    for (var i=0; i<completedIncomingReviews.length; i++) {
      if (completedIncomingReviews[i].returnValues.rating === '2') {
        numPositive++;
      }
    }
    var result = (numPositive * 100) / completedIncomingReviews.length;
    this.setState({
      positivePercent: result.toFixed(0)
    });
  };

  render() {
    const { activeItem, activeReviewItem } = this.state
    return (
      <div>
      <Menu icon='labeled' fixed='bottom' horizontal>
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
        <Header.Subheader><font color="green">{this.state.positivePercent}% </font>positive feedback from {this.state.completedIncomingReviews.length} reviews</Header.Subheader>
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
          <CompletedReviewList type='incoming' boomerang={this.props.boomerang} completedReviews={this.state.completedIncomingReviews} />
        </div>
        <div hidden={this.state.activeReviewItem !== 'outgoing'}>
          <CompletedReviewList type='outgoing' boomerang={this.props.boomerang} completedReviews={this.state.completedOutgoingReviews} />
        </div>
      </div>
      </div>
    )
  }
}