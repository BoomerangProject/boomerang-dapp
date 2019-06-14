import React, { Component } from "react";
import { ToastMessage } from 'rimble-ui';
import { Header, 
        Divider,
        Segment,
        Form,
        Input,
        Button,
        TextArea,
        Accordion,
        Icon
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

export default class BusinessDashboard extends Component {


  constructor(props) {
    super(props);
    this.state = {
      txDetails: '',
      customerAddress: '0x0000000000000000000000000000000000000000',
      customerBoomReward: '0',
      customerXpReward: '0',
      activeIndex: 99
    };
    this.boomerangAddress = this.props.boomerangAddress;
    this.boomerang = this.props.boomerang;
    this.boomerangToken = this.props.boomerangToken;
    this.accounts = this.props.accounts;
  }

  approveFunds = async () => {
    let tx = await this.props.boomerangToken.methods.approve(this.props.boomerangAddress, this.props.web3.utils.toWei('10000000000')).send({ from: this.props.accounts[0] });
    window.toastProvider.addMessage('Processing transaction...', {
      secondaryMessage: 'Check progress on Etherscan',
      actionHref:
        'https://etherscan.io/tx/' + tx.transactionHash,
      actionText: 'Check',
      variant: 'processing',
    })
  };

  requestReview = async () => {
    let tx = await this.props.boomerang.methods.requestBusinessReview(this.state.customerAddress, this.state.customerBoomReward, this.state.customerXpReward, this.state.txDetails).send({ from: this.props.accounts[0] });
    window.toastProvider.addMessage('Processing transaction...', {
      secondaryMessage: 'Check progress on Etherscan',
      actionHref:
        'https://etherscan.io/tx/' + tx.transactionHash,
      actionText: 'Check',
      variant: 'processing',
    })
  };

  updateTxDetails(event) {
    const txDetails = event.target.value;
    this.setState({txDetails: txDetails});
  }

  updateCustomerAddress(event) {
    const customerAddress = event.target.value;
    this.setState({customerAddress: customerAddress});
  }

  updateCustomerXpReward(event) {
    const xpReward = event.target.value;
    this.setState({customerXpReward: xpReward});
  }

  updateCustomerBoomReward(event) {
    const boomReward = event.target.value;
    this.setState({customerBoomReward: this.props.web3.utils.toWei(boomReward)});
    console.log(this.props.web3.utils.toWei(boomReward))
  }

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex } = this.state
    return (
      <div>
        <Header as='h1'> Business Dashboard
        <Header.Subheader>Request reviews from your customers</Header.Subheader>
        </Header>
        <Divider />
        <div hidden={this.props.approvedFunds}>
          <Form>
            <Segment>
              <Header as='h3'>Approve Funds </Header>
              <Header.Subheader>You must allow the Boomerang contract to move your BOOMS</Header.Subheader>
              <Divider section />
              <Form.Field control={Button} onClick={this.approveFunds}>Approve</Form.Field>
            </Segment>
          </Form>
        </div>
        <div hidden={!this.props.approvedFunds}>
          <Accordion fluid styled>
            <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleAccordionClick}>
              <Icon name='dropdown' />
              Request Business Review
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
              <Form>
                <Segment>
                  <Header as='h3'>Review Request Form</Header>
                  <Form.Field onChange={(event) => this.updateCustomerAddress(event)} control={Input} label='Customer Address' placeholder='0x0000000000...' />

                  <Divider section />

                  <Form.Field onChange={(event) => this.updateCustomerBoomReward(event)} type="number" control={Input} label='BOOM Reward' placeholder='0' />

                  <Divider section />

                  <Form.Field onChange={(event) => this.updateCustomerXpReward(event)}  type="number" control={Input} label='XP Reward' placeholder='0' />

                  <Divider section />

                  <Form.Field onChange={(event) => this.updateTxDetails(event)} control={TextArea} label='Transaction Details' placeholder='Bought a digital asset from our store...' />

                  <Divider section />

                  <Form.Field control={Button} onClick={this.requestReview}>Submit</Form.Field>
                </Segment>
              </Form>
            </Accordion.Content>
            <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleAccordionClick}>
              <Icon name='dropdown' />
              Request Worker Review
            </Accordion.Title>
            <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleAccordionClick}>
              <Icon name='dropdown' />
              Add Worker
            </Accordion.Title>
          </Accordion>
        </div>
        <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
      </div>
    )
  }
}