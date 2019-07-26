import React, { Component } from "react";
import {
  Container,
  Image,
  Menu,
  Icon,
  Input
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

export default class header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      profile: '/profile?address=' + this.props.address
    };
    this.boomBalance = this.props.boomBalance;
  }

  componentDidUpdate(props){
    this.boomBalance = this.props.boomBalance;
  }

  render() {
    return (
      <div>
        <Menu fixed='top' inverted>
          <Container>
              <Menu.Item as='a' href="/home" header>
                <Image size='small' src='https://raw.githubusercontent.com/BoomerangProject/boomerang-wiki/master/images/logo.png' style={{ marginRight: '1.5em' }} />
              </Menu.Item>
            <Menu.Menu position='right' inverted>
              <Menu.Item>
                <Input icon='search' placeholder='Search businesses...' />
              </Menu.Item>
              <Menu.Item as='a' href={this.state.profile}><Icon name='user circle' size='big'/>
                <Image size='mini' src='https://avatars0.githubusercontent.com/u/39594620?s=400&u=8ec1b79002688db2c657076ecc6c306fe200cea5&v=4' style={{ marginRight: '1.5em' }} /> {this.boomBalance} 
              </Menu.Item>
            </Menu.Menu>
          </Container>
        </Menu>
      </div>
    )
  }
}