import Web3 from "web3";
import Portis from '@portis/web3';

const FALLBACK_WEB3_PROVIDER = process.env.REACT_APP_NETWORK || 'http://0.0.0.0:8545';

require('dotenv').config();

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    const isProd = process.env.NODE_ENV === 'production';
    const isTestnet = process.env.NODE_ENV === 'ropsten';
    if (isProd) {
      const portis = new Portis('c90a041f-1b3c-4a53-91e2-006e1e628690', 'mainnet', { scope: ['email'] });;
      const web3 = new Web3(portis.provider);

      portis.onLogin((walletAddress, email) => {
        console.log(walletAddress, email);
      });

      resolve(web3);
    } else if (isTestnet) {
      // Configure portis with ropsten
    } else {
        // Wait for loading completion to avoid race conditions with web3 injection timing.
        window.addEventListener("load", async () => {
          // Modern dapp browsers...
          if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            try {
              // Request account access if needed
              await window.ethereum.enable();
              // Acccounts now exposed
              resolve(web3);
            } catch (error) {
              reject(error);
            }
          }
          // Legacy dapp browsers...
          else if (window.web3) {
            // Use Mist/MetaMask's provider.
            const web3 = window.web3;
            console.log("Injected web3 detected.");
            resolve(web3);
          }
          // Fallback to localhost; use dev console port by default...
          else {
            const provider = new Web3.providers.HttpProvider(
              FALLBACK_WEB3_PROVIDER
            );
            const web3 = new Web3(provider);
            console.log("No web3 instance injected, using Infura/Local web3.");
            resolve(web3)
          }
        });

    }
  });

const getGanacheWeb3 = () => {
  return null;
  // const isProd = process.env.NODE_ENV === 'production';
  // if (isProd) {
  //   return null;
  // }
  // const provider = new Web3.providers.HttpProvider(
  //   'http://0.0.0.0:8545'
  // );
  // const web3 = new Web3(provider);
  // console.log("No local ganache found.");
  // return web3;
}

export default getWeb3;
export { getGanacheWeb3 };
