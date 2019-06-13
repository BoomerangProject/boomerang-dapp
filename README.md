# boomerang-dapp


## How to run

In a terminal, run a local instance of the ethereum blockchain (take note of the first address listed): 

`ganache-cli --secure -u 0 -u 1 -u 2 --deterministic`



In another terminal session, run the following commands (within this project):

```
zos add BoomerangToken
zos add Boomerang
zos session --network development --from {your address from step 1} --expires 3600
zos push --deploy-dependencies
zos create BoomerangToken --init initialize
```
Note the address of the deployed BoomerangToken, then run the following commands:
```
zos create Boomerang --init --args '{Address of BoomerangToken contract}'
```
Now switch to the client directory and run:
```
npm run start
```

## How to test manually
To test manually you must provide your web3 account with Ether to pay gas costs, and BOOM tokens to use for rewarding reviews. To do this we must use the truffle command line to send our web3 account some Ether and BOOM tokens:
```
truffle console
web3.eth.sendTransaction({to:'<Web3 Account Address>', from:'<Ganache Address>', value:web3.utils.toWei("0.5", "ether")})
BoomerangToken.at('<Boomerang Token Address>').then(token => token.transfer('<Web3 Account Address>', web3.utils.toWei("1000", "ether")));
