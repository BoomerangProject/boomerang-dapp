import React, { Component } from "react";
import {
  Header,
  Image,
  Input,
  Button
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      email: ''
    }
  }

  updateEmail(event) {
    const email = event.target.value;
    this.setState({email: email});
  }

  async handleBuy() {
    console.log('BUY MICROWAVE');
    const response = await fetch('http://localhost:8393/emails/' + this.state.email);
    if (response.status === 404) {
      console.log('Email doesnt exist!');
      let txResponse = await fetch('http://localhost:3001/sendemail/' + this.state.email);
      console.log(txResponse);
    } else {
      let txResponse = await fetch('http://localhost:3001/sendtx');
      console.log(txResponse);
    }

  }

  render() {
    return (
      <div style={{ width: '55%', margin: 'auto', marginTop: '2%'}}>
        <Header
          as='h1'
          content="Frank's Hardware Store"
          subheader='All of your hardware needs!'
          textAlign='center'
        />
        <Image src='https://pisces.bbystatic.com/image2/BestBuy_US/images/products/3901/3901007cv1d.jpg;maxHeight=1000;maxWidth=1000' />
        <div style={{ marginLeft: '30%'}}>
          <Input style={{ margin: 'auto' }} placeholder='Email' onChange={(event) => this.updateEmail(event)} />
          <button class="ui button" onClick={this.handleBuy.bind(this)}>Buy Microwave</button>
        </div>
      </div>
    );
  }
}

export default App;
