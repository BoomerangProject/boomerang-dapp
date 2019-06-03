import React, {Component} from 'react';
import { ToastMessage } from 'rimble-ui';
import { Card, Form, Icon, Button, TextArea } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

class ReviewRequestItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boomReward: 0,
      xpReward: 0
    };
    this.reviewId = this.props.reviewRequest.returnValues.reviewId;
    this.txDetails = this.props.reviewRequest.returnValues.txDetailsHash;
    this.business = this.props.reviewRequest.returnValues.business.substring(0, 10) + '...';
  }

  async componentDidMount() {
    const boomReward = await this.props.boomerang.methods.getCustomerBoomReward(this.reviewId).call();
    const xpReward = await this.props.boomerang.methods.getCustomerXpReward(this.reviewId).call();
    this.setState({ boomReward: this.props.web3.utils.fromWei(boomReward), xpReward: xpReward });
  }

  submitReview = async (rating) => {
    let tx = await this.props.boomerang.methods.completeReview(this.reviewId, rating, 'was cool').send({ from: this.props.accounts[0] });
    window.toastProvider.addMessage('Processing transaction...', {
      secondaryMessage: 'Check progress on Etherscan',
      actionHref:
        'https://etherscan.io/tx/' + tx.transactionHash,
      actionText: 'Check',
      variant: 'processing',
    })
  };

  submitBadReview = async () => {
    this.submitReview('0')
  };

  submitNeutralReview = async () => {
    this.submitReview('1')
  };

  submitGoodReview = async () => {
    this.submitReview('2')
  };

  render() {
    return (
      <Card fluid>
        <Card.Content>
          <Card.Header>Rate Your Experience:</Card.Header>
          <Card.Description>
            <strong> {this.business} </strong> wants to know your opinion about a recent interaction: <br /> <strong>{this.txDetails}</strong>
          </Card.Description>
        </Card.Content>
        <Card.Content>
          <Card.Description>
            You will receive: <br /> <strong> {this.state.boomReward} BOOM <br /> 5 xp </strong> with <strong>{this.business}</strong>
          </Card.Description>
        </Card.Content>
        <Card.Content>
          <Card.Description>
            Leave a review of your interaction here (optional)
          </Card.Description>
          <Form>
            <TextArea />
          </Form>
        </Card.Content>
        <Card.Content extra>
          <div className='ui three buttons'>
            <Button basic color='red' onClick={this.submitBadReview}>
              <Icon size='large' name='frown outline' />
            </Button>
            <Button basic color='yellow' onClick={this.submitNeutralReview}>
              <Icon size='large' name='meh outline' />
            </Button>
            <Button basic color='green' onClick={this.submitGoodReview}>
              <Icon size='large' name='smile outline' />
            </Button>
          </div>
        </Card.Content>
      </Card>
    );
  }
}

export default ReviewRequestItem;
