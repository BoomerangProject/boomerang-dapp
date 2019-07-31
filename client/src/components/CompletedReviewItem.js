import React, {Component} from 'react';
import { Card, Icon } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

class CompletedReviewItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boomReward: 0,
      xpReward: 0,
      reviewText: '',
      businessName: this.props.completedReview.returnValues.business.substring(0, 10) + '...',
      customerName: this.props.completedReview.returnValues.customer.substring(0, 10) + '...',
    };

    this.businessList = this.props.businessList;

    this.reviewId = this.props.completedReview.returnValues.reviewId;
    this.review = this.props.completedReview.returnValues.reviewHash;

    this.business = this.props.completedReview.returnValues.business.substring(0, 10) + '...';
    this.businessLink = '/profile?address=' + this.props.completedReview.returnValues.business;

    this.customer = this.props.completedReview.returnValues.customer.substring(0, 10) + '...';
    this.customerLink = '/profile?address=' + this.props.completedReview.returnValues.customer;

    this.rating = this.props.completedReview.returnValues.rating;
  }

  async componentDidMount() {
    const businessList = this.businessList;

    const customer = this.props.completedReview.returnValues.customer;
    let customerName = this.state.customerName;

    const business = this.props.completedReview.returnValues.business;
    let businessName = this.state.businessName;

    Object.keys(businessList).forEach(function(e) {
      if (businessList[e].ethaddr === business){
        businessName = businessList[e].name;
      } else if (businessList[e].ethaddr === customer) {
        customerName = businessList[e].name;
      }
    })
    this.setState({ businessName: businessName, customerName: customerName });
  }



  render() {

    let cardRating = <Card.Header><Icon name='frown outline' color='red' size='big'/></Card.Header>
    if (this.rating === '1') {
      cardRating = <Card.Header><Icon name='meh outline' color='yellow' size='big'/></Card.Header>
    } else if (this.rating === '2') {
      cardRating = <Card.Header><Icon name='smile outline' color='green' size='big'/></Card.Header>
    }

    let cardContent = <Card.Content><Card.Header>Review from <a href={this.customerLink}>{this.state.customerName}</a></Card.Header><Card.Description>{cardRating}<strong>{this.review}</strong></Card.Description></Card.Content>
    if (this.props.type === 'outgoing') {
      cardContent = <Card.Content><Card.Header>Review of <a href={this.businessLink}>{this.state.businessName}</a></Card.Header><Card.Description>{cardRating}<strong>{this.review}</strong></Card.Description></Card.Content>
    }



    return (
      <Card fluid>
        {cardContent}
      </Card>
    );
  }
}

export default CompletedReviewItem;
