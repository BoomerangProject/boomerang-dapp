import React, { Component } from "react";
import { Icon, Menu, Header, Container, Button, Card, Image, Modal, TextArea, Form} from 'semantic-ui-react'
import CompletedReviewList from './CompletedReviewList'
import 'semantic-ui-css/semantic.min.css'

export default class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      activeItem: 'profile', 
      activeReviewItem: 'incoming',
      completedIncomingReviews: [],
      address: this.props.address,
      profileName: 'Unnamed',
      profileDesc: 'No Description...',
      editedProfileName: 'Unnamed',
      editedProfileDesc: 'No Description...',
      editedProfileEmail: 'example@gmail.com',
      modalOpen: false
    }
    this.userAddress = this.props.userAddress;
    this.address = this.props.address;
    this.boomerang = this.props.boomerang;
  }

  async componentDidMount(props) {
    const response = await fetch('http://localhost:8393/emails/');
    const myJson = await response.json();
    const address = this.address;
    let myObj = [];
    Object.keys(myJson).forEach(function(e) {
      if (myJson[e].ethaddr === address){
        myObj = myJson[e];
      }
    })
    if (myObj.name){
      this.setState({ profileName: myObj.name, editedProfileName: myObj.name })
    } 

    if (myObj._id){
      this.setState({ email: myObj._id });
    }

    if (myObj.desc) {
      this.setState({ profileDesc: myObj.desc, editedProfileDesc: myObj.desc })
    }
    
  }


  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  editProfile = async (e) => {
    var doesExist = false;
    const response = await fetch('http://localhost:8393/emails/');
    const myJson = await response.json();
    const userAddress = this.userAddress;
    Object.keys(myJson).forEach(function(e) {
      if (myJson[e].ethaddr === userAddress){
        doesExist = true;
      }
    })
    if (doesExist) {
      const response = await fetch('http://localhost:8393/emails/' + this.state.email, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
          body: JSON.stringify({"name": this.state.editedProfileName, "desc": this.state.editedProfileDesc})
      });
      console.log(response);
      this.handleClose();
      window.location.reload();
    } else {
      const response = await fetch('http://localhost:8393/emails/', {
          method: 'POST',
          headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
          body: JSON.stringify({"_id": this.state.editedProfileEmail ,"ethaddr": this.userAddress, "name": this.state.editedProfileName, "desc": this.state.editedProfileDesc})
      });
      this.handleClose();
      window.location.reload();
    }
  };

  updateProfileName(event) {
    const profileName = event.target.value;
    this.setState({editedProfileName: profileName});
    console.log(profileName);
  }

  updateProfileDesc(event) {
    const profileDesc = event.target.value;
    this.setState({editedProfileDesc: profileDesc});
    console.log(profileDesc);
  }

  updateProfileEmail(event) {
    const profileEmail = event.target.value;
    this.setState({editedProfileEmail: profileEmail});
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
      console.log(events);
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
        disabled
          name='workers'
          active={activeItem === 'workers'}
          onClick={this.handleItemClick}
        >
          <Icon name='suitcase' />
          Workers
        </Menu.Item>

        <Menu.Item
          disabled
          name='rewards'
          active={activeItem === 'rewards'}
          onClick={this.handleItemClick}
        >
          <Icon name='trophy'/>
          Rewards
        </Menu.Item>
      </Menu>
      <div hidden={this.state.activeItem !== 'profile'}>
          <Card>
            <Image src='https://www.seekpng.com/png/detail/365-3651600_default-portrait-image-generic-profile.png' wrapped ui={false} />
            <Card.Content>
              <Card.Header>{this.state.profileName}</Card.Header>
              <Card.Meta>
                <span className='date'>{this.address}</span>
              </Card.Meta>
              <Card.Description>
                {this.state.profileDesc}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className='ui one buttons'>
                <div hidden={this.userAddress !== this.address}>
                  <Modal 
                    size='small' 
                    open={this.state.modalOpen} 
                    onClose={this.handleClose} 
                    trigger={<Button onClick={this.handleOpen} color='green' basic>Edit Profile</Button>} 
                    centered={false}
                  >
                    <Modal.Header>Edit Profile</Modal.Header>
                    <Modal.Content image>
                     <Image src='https://www.seekpng.com/png/detail/365-3651600_default-portrait-image-generic-profile.png' wrapped size="medium"/>
                      <Modal.Description>
                        <Form fluid>
                          <Form.Field>
                            <label>Profile Name</label>
                            <input onChange={(event) => this.updateProfileName(event)} placeholder={this.state.editedProfileName} />
                          </Form.Field>
                          <Form.Field>
                            <label>Profile Description</label>
                            <TextArea onChange={(event) => this.updateProfileDesc(event)} placeholder={this.state.editedProfileDesc} style={{ minHeight: 100 }} />
                          </Form.Field>
                          <Form.Field>
                            <label>Profile Email</label>
                            <input onChange={(event) => this.updateProfileEmail(event)} placeholder='TEMPORARY INPUT' />
                          </Form.Field>
                        </Form>
                      </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                      <Button negative onClick={this.handleClose}>Cancel</Button>
                      <Button positive icon='checkmark' labelPosition='right' content='Save' onClick={this.editProfile}/>
                    </Modal.Actions>
                  </Modal>
                </div>
                <div hidden={this.userAddress === this.address}>
                  <Button color='green' basic>
                    Request Review
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
      </div>
      <div hidden={this.state.activeItem !== 'reviews'}>
        <Header as='h1'> {this.state.profileName} </Header>
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