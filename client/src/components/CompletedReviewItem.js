import React, {Component} from 'react';
import { Card, Form, Icon, Button, TextArea } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

class CompletedReviewItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boomReward: 0,
      xpReward: 0,
      reviewText: ''
    };
    this.reviewId = this.props.completedReview.returnValues.reviewId;
    this.review = this.props.completedReview.returnValues.reviewHash;
    this.business = this.props.completedReview.returnValues.business.substring(0, 10) + '...';

    this.customer = this.props.completedReview.returnValues.customer.substring(0, 10) + '...';
    this.customerLink = '/profile?address=' + this.props.completedReview.returnValues.customer;

    this.rating = this.props.completedReview.returnValues.rating;
  }


  render() {

    let card = <Card.Header><Icon name='frown outline' color='red' size='big'/></Card.Header>
    if (this.rating === '1') {
      card = <Card.Header><Icon name='meh outline' color='yellow' size='big'/></Card.Header>
    } else if (this.rating === '2') {
      card = <Card.Header><Icon name='smile outline' color='green' size='big'/></Card.Header>
    }

    return (
      <Card fluid>
        <Card.Content>
          <Card.Header>Review from <a href={this.customerLink}>{this.customer}</a>: </Card.Header>
          <Card.Description>
            {card}
            <strong>{this.review}</strong>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

export default CompletedReviewItem;
