# Homework Report

## Team name: The Buidlers

## Team members:

- Tobias Leinss <caruso33@web.de>
- Lucien Akchoté <l.akchote@gmail.com>
- Alok Sahay <alok.sahay87@gmail.com>
- Ana G. Jordano <anagjordano@gmail.com>

## Deploying contract

### MyToken

- Ropsten address of deployed contract: 0x5Acd734B0743919CAFA866818dCcCcd34c7d5f52
- Transaction: 0x043c4ef7aed117650165e9baff5f14e7a909aa2bd33ff7a5f668c1ac1e550031
- [Block Explorer](https://ropsten.etherscan.io/address/0x5Acd734B0743919CAFA866818dCcCcd34c7d5f52)

### CustomBallot

- Ropsten address of deployed contract: 0x662F26b3A3Ddd5E91D5e6B85Fd9E253a873e33E6
- Transaction: 0xc79e33d63cc968eb6c0948a4d7ce24378655612d3be9604f1b62ae05f4ecf88e
- [Block Explorer](https://ropsten.etherscan.io/address/0x662F26b3A3Ddd5E91D5e6B85Fd9E253a873e33E6)

## Weekend Project

- Form groups of 3 to 5 students
- Complete the contracts together
- Structure scripts to
  - Deploy everything
  - Interact with the ballot factory
  - Query proposals for each ballot
  - Operate scripts
- Publish the project in Github
- Run the scripts with a few set of proposals, play around with token balances, cast and delegate votes, create ballots from snapshots, interact with the ballots and inspect results
- Write a report detailing the addresses, transaction hashes, description of the operation script being executed and console output from script execution for each step
- (Extra) Use TDD methodology

## Operation logs

### Deployment

```shell
❯ yarn deploy:ropsten:token
yarn run v1.22.15
$ ts-node scripts/deploymentToken.ts ropsten
Using address 0x4bFC74983D6338D3395A00118546614bB78472c2
Wallet balance 9.980619454909341
__________________________________________________
Deploying MyToken contract
Awaiting confirmations
========= NOTICE =========
Request-Rate Exceeded  (this message will not be repeated)

The default API keys for each service are provided as a highly-throttled,
community resource for low-traffic projects and early prototyping.

While your application will continue to function, we highly recommended
signing up for your own API keys to improve performance, increase your
request rate/limit and enable other perks, such as metrics and advanced APIs.

For more details: https://docs.ethers.io/api-keys/
==========================
Contract deployed at 0x5Acd734B0743919CAFA866818dCcCcd34c7d5f52
Minting tokens for address 0x4bFC74983D6338D3395A00118546614bB78472c2, previous balance : 0.0 tokens...
Minted tokens for address 0x4bFC74983D6338D3395A00118546614bB78472c2, new balance : 20.0 tokens.
Self delegating to track voting power and enable checkpoints...
Minting 20 tokens to 0x49E499F56dA1aFd2c734584a2f3e5E7B5ad72ebb...
Minting 20 tokens to 0x10f403726407d55de84ac831405516Fc4821b937...
Minting 20 tokens to 0xD89ffDef0d21c3E03A6AF09Aa31695B6e0414c31...
Minting 20 tokens to 0x5Ed02CF700D92d64776e11c6E85D2D7d11e9bcf8...
Completed
__________________________________________________
✨  Done in 98.65s.
```

### Create constructor args

```shell
❯ yarn create:args
yarn run v1.22.15
$ ts-node scripts/createConstructorArgs.ts Pizza Lasagna Icecream
[
  '0x50697a7a61000000000000000000000000000000000000000000000000000000',
  '0x4c617361676e6100000000000000000000000000000000000000000000000000',
  '0x496365637265616d000000000000000000000000000000000000000000000000'
]
✨  Done in 2.24s.
```

### Contract verification

#### MyToken

```shell
❯ yarn hardhat verify --network ropsten 0x5Acd734B0743919CAFA866818dCcCcd34c7d5f52
yarn run v1.22.15
$ /Users/tobias/Code/encode_bootcamp/08-Tokenized-Votes/Project/node_modules/.bin/hardhat verify --network ropsten 0x5Acd734B0743919CAFA866818dCcCcd34c7d5f52
Nothing to compile
No need to generate any newer typings.
Successfully submitted source code for contract
contracts/Token.sol:MyToken at 0x5Acd734B0743919CAFA866818dCcCcd34c7d5f52
for verification on the block explorer. Waiting for verification result...

Successfully verified contract MyToken on Etherscan.
https://ropsten.etherscan.io/address/0x5Acd734B0743919CAFA866818dCcCcd34c7d5f52#code
✨  Done in 36.31s.
```

#### CustomBallot

```shell
❯ yarn hardhat verify --network ropsten --constructor-args scripts/constructorArgs.ts 0x662F26b3A3Ddd5E91D5e6B85Fd9E253a873e33E6
yarn run v1.22.15
$ /Users/tobias/Code/encode_bootcamp/08-Tokenized-Votes/Project/node_modules/.bin/hardhat verify --network ropsten --constructor-args scripts/constructorArgs.ts 0x662F26b3A3Ddd5E91D5e6B85Fd9E253a873e33E6
Generating typings for: 12 artifacts in dir: typechain for target: ethers-v5
Successfully generated 17 typings!
Compiled 12 Solidity files successfully
Successfully submitted source code for contract
contracts/CustomBallot.sol:CustomBallot at 0x662F26b3A3Ddd5E91D5e6B85Fd9E253a873e33E6
for verification on the block explorer. Waiting for verification result...

Successfully verified contract CustomBallot on Etherscan.
https://ropsten.etherscan.io/address/0x662F26b3A3Ddd5E91D5e6B85Fd9E253a873e33E6#code
✨  Done in 38.27s.
```
