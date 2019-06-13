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
