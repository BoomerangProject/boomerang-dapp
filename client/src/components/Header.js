import React, { Component } from "react";
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

export default class header extends Component {

  constructor(props) {
    super(props);
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
            <a href="/home">
              <Menu.Item as='a' header>
                <Image size='small' src='https://raw.githubusercontent.com/BoomerangProject/boomerang-wiki/master/images/logo.png' style={{ marginRight: '1.5em' }} />
              </Menu.Item>
            </a>
            <a href="/dashboard"><Menu.Item as='a'>Dashboard</Menu.Item></a>
            <a href="/business-dashboard"><Menu.Item as='a'>Business Dashboard</Menu.Item></a>
            <Menu.Menu position='right' inverted>
              <Menu.Item><Image size='mini' src='https://avatars0.githubusercontent.com/u/39594620?s=400&u=8ec1b79002688db2c657076ecc6c306fe200cea5&v=4' style={{ marginRight: '1.5em' }} /> {this.boomBalance} </Menu.Item>
            </Menu.Menu>
          </Container>
        </Menu>
      </div>
    )
  }
}