import React, { Component } from "react";
import ReviewRequestList from './ReviewRequestList'
import { Header, 
        Divider,
        Segment,
        Form,
        Input,
        Button,
        TextArea,
        Card,
        Image,
        Icon
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

export default class CustomerDashboard extends Component {


  constructor(props) {
    super(props);
  }

  render() {
    let message = <div></div>
    if (this.props.reviewRequests.length === 0) {
      message = <Header>You have no reviews to complete at this time.</Header>
    }

    return (
      <div>
        <Header as='h1'> Boomerang Dashboard
        <Header.Subheader>Earn BOOMs by completing reviews</Header.Subheader>
        </Header>
        <Divider />
        <ReviewRequestList web3={this.props.web3} accounts={this.props.accounts} boomerang={this.props.boomerang} reviewRequests={this.props.reviewRequests} />
        {message}
      </div>
    )
  }
}