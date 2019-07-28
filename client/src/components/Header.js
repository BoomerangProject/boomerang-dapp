import React, { Component } from "react";
import _ from 'lodash'
import {
  Container,
  Image,
  Menu,
  Icon,
  Search
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

const initialState = { isLoading: false, results: [], value: '' }



export default class header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      profile: '/profile?address=' + this.props.address,
      source: [],
      isLoading: false,
      results: [],
      value: ''
    };
    this.boomBalance = this.props.boomBalance;
  }

  async componentDidMount(props) {
    const response = await fetch('http://localhost:8393/emails/');
    const myJson = await response.json();
    Object.keys(myJson).forEach(function(e) {
      myJson[e].title = myJson[e].name;
      myJson[e].description = myJson[e].desc;
    })
    this.setState({source: myJson});
  }

  componentDidUpdate(props){
    this.boomBalance = this.props.boomBalance;
  }

  handleResultSelect = (e, { result }) => {
    window.location.replace('/profile?address=' + result.ethaddr);
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState)

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.name)

      this.setState({
        isLoading: false,
        results: _.filter(this.state.source, isMatch),
      })
    }, 300)
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
                <Search
                  loading={this.state.isLoading}
                  onResultSelect={this.handleResultSelect}
                  onSearchChange={_.debounce(this.handleSearchChange, 500, {
                    leading: true,
                  })}
                  results={this.state.results}
                  value={this.state.value}
                  {...this.props}
                />
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