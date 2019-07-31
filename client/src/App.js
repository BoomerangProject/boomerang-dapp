import React, { Component } from "react";
import getWeb3, { getGanacheWeb3 } from "./utils/getWeb3";
import Header from "./components/Header.js";
import BusinessDashboard from "./components/BusinessDashboard.js";
import CustomerDashboard from "./components/CustomerDashboard.js";
import Profile from "./components/Profile.js";
import { Loader, ToastMessage } from 'rimble-ui';
import styles from './App.module.scss';

const urlParams = new URLSearchParams(window.location.search);

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    route: window.location.pathname.replace("/",""),
    option:  urlParams.get('address'),
    boomBalance: 0,
    approvedFunds: false,
    reviewRequests: []
  };

  getGanacheAddresses = async () => {
    if (!this.ganacheProvider) {
      this.ganacheProvider = getGanacheWeb3();
    }
    if (this.ganacheProvider) {
      return await this.ganacheProvider.eth.getAccounts();
    }
    return [];
  }

  componentDidMount = async () => {

    // Load in contracts
    let Boomerang = {};
    let BoomerangToken = {};
    try {
      Boomerang = require("../../contracts/Boomerang.sol");
      BoomerangToken = require("../../contracts/BoomerangToken.sol");
    } catch (e) {
      console.log(e);
    }

    try {
      const isProd = process.env.NODE_ENV === 'production';
      if (!isProd) {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
        const ganacheAccounts = await this.getGanacheAddresses();
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const isMetaMask = web3.currentProvider.isMetaMask;
        let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]): web3.utils.toWei('0');
        balance = web3.utils.fromWei(balance, 'ether');

        let boomerangInstance = null;
        let boomerangAddress = null;
        let tokenInstance = null;
        let tokenAddress = null;

        let deployedNetwork = null;
        if (Boomerang.networks) {
          deployedNetwork = Boomerang.networks[networkId.toString()];
          if (deployedNetwork) {
            boomerangInstance = new web3.eth.Contract(
              Boomerang.abi,
              deployedNetwork && deployedNetwork.address,
            );
            boomerangAddress = deployedNetwork.address;
          }
        }
        if (BoomerangToken.networks) {
          deployedNetwork = BoomerangToken.networks[networkId.toString()];
          if (deployedNetwork) {
            tokenInstance = new web3.eth.Contract(
              BoomerangToken.abi,
              deployedNetwork && deployedNetwork.address,
            );
            tokenAddress = deployedNetwork.address;
          }
        }

        if (boomerangInstance || tokenInstance) {

          // Set web3, accounts, and contract to the state, and then proceed with an
          // example of interacting with the contract's methods.
          this.setState({ web3, ganacheAccounts, accounts, balance, networkId,
            isMetaMask, boomerang: boomerangInstance, boomerangAddress: boomerangAddress, 
            boomerangToken: tokenInstance, tokenAddress: tokenAddress}, () => {
              this.refreshValues(boomerangInstance, tokenInstance);
              setInterval(() => {
                this.refreshValues(boomerangInstance, tokenInstance);
              }, 1000);
            });
        }


        this.setState({ web3, ganacheAccounts, accounts, balance, networkId, isMetaMask });
      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  refreshValues = (boomerangInstance, tokenInstance) => {
    if (tokenInstance) {
      this.getBoomBalance();
      if (!this.state.approvedFunds) {
        this.checkApprovedFunds();
      }
    }
    if (boomerangInstance) {
      this.getReviewRequests();
    }
  }



  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  getBoomBalance = async () => {
    const { boomerangToken } = this.state;
    // Get the value from the contract to prove it worked.
    const response = await boomerangToken.methods.balanceOf(this.state.accounts[0]).call();
    // Update state with the result.
    this.setState({ boomBalance: this.state.web3.utils.fromWei(response) });
  }

  checkApprovedFunds = async () => {
    const { boomerangToken, boomerangAddress } = this.state;
    // Get the value from the contract to prove it worked.
    const allowance = await boomerangToken.methods.allowance(this.state.accounts[0], boomerangAddress).call();
    if (allowance > 0) {
      this.setState({ approvedFunds: true });
    }
  }

  getReviewRequests = async () => {
    const { boomerang } = this.state;


    let completedReviewIds = []
    await boomerang.getPastEvents('ReviewCompleted', {
      fromBlock: 0,
      toBlock: 'latest'
    }, async (err, events) => {
      for (var i=0; i<events.length;i++) {
        if (events[i].returnValues.customer === this.state.accounts[0]) {
          completedReviewIds.push(events[i].returnValues.reviewId);
        }
      }
    })

    let newReviews = [];
    await boomerang.getPastEvents('ReviewRequested', {
      fromBlock: 0,
      toBlock: 'latest'
    }, async (err, events) => {
      for (var i=0; i<events.length;i++) {
        if (events[i].returnValues.customer === this.state.accounts[0]) {
          if (!completedReviewIds.includes(events[i].returnValues.reviewId)) {
            newReviews.push(events[i]);
          }
        }
      }
      this.setState({ reviewRequests: newReviews });
    })
  }

  renderLoader() {
    return (
      <div className={styles.loader}>
        <Loader size="80px" color="red" />
        <h3> Loading Web3, accounts, and contract...</h3>
        <p> Unlock your metamask </p>
      </div>
    );
  }

  renderHome() {
    return (
      <div className={styles.loader}>
        <Loader size="80px" color="red" />
        <h3> Loading Web3, accounts, and contract...</h3>
        <p> Unlock your metamask </p>
      </div>
    );
  }

  renderDashboard() {
    return (
      <div className={styles.dashboard}>
        <CustomerDashboard 
          web3={this.state.web3}
          boomerang={this.state.boomerang} 
          reviewRequests={this.state.reviewRequests} 
          accounts={this.state.accounts} />
      </div>
    );
  }

  renderBusinessDashboard() {
    return (
      <div className={styles.dashboard}>
        <BusinessDashboard 
          web3={this.state.web3}
          boomerang={this.state.boomerang} 
          boomerangAddress={this.state.boomerangAddress} 
          boomerangToken={this.state.boomerangToken} 
          accounts={this.state.accounts}
          approvedFunds={this.state.approvedFunds} />
      </div>
    );
  }

  renderProfile() {
    return (
      <div className={styles.dashboard}>
        <Profile web3={this.state.web3} approvedFunds={this.state.approvedFunds} userAddress={this.state.accounts[0]} address={this.state.option} boomerang={this.state.boomerang} />
      </div>
    );
  }

  render() {
    if (!this.state.web3) {
      return this.renderLoader();
    }
    return (
      <div className={styles.App}>
        <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
        <Header boomBalance = {this.state.boomBalance} address={this.state.accounts[0]}/>
        {this.state.route === '' && this.renderDashboard()}
        {this.state.route === 'home' && this.renderDashboard()}
        {this.state.route === 'dashboard' && this.renderDashboard()}
        {this.state.route === 'business-dashboard' && this.renderBusinessDashboard()}
        {this.state.route === 'profile' && this.renderProfile()}
      </div>
    );
  }
}

export default App;
