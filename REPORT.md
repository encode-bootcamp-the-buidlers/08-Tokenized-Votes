# Homework Report

## Team name: The Buidlers

## Team members:

- Tobias Leinss <caruso33@web.de>
- Lucien Akchoté <l.akchote@gmail.com>
- Alok Sahay <alok.sahay87@gmail.com>

## Deploying contract

### MyToken

- Ropsten address of deployed contract: 0x3311bAcC036f0007638CF63820a1bdeE00903678
- Transaction: 0x043c4ef7aed117650165e9baff5f14e7a909aa2bd33ff7a5f668c1ac1e550031
- [Block Explorer](https://ropsten.etherscan.io/address/0x3311bAcC036f0007638CF63820a1bdeE00903678)

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
$ ts-node scripts/deployment.ts ropsten Pizza Lasagna Icecream
Using address 0x4bFC74983D6338D3395A00118546614bB78472c2
Wallet balance 9.994224730972947
__________________________________________________
Deploying MyToken contract
Awaiting confirmations
Completed
Contract deployed at 0x3311bAcC036f0007638CF63820a1bdeE00903678
__________________________________________________
Deploying CustomBallot contract
Proposals:
Proposal N. 1: Pizza
Proposal N. 2: Lasagna
Proposal N. 3: Icecream
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
Completed
Contract deployed at 0x662F26b3A3Ddd5E91D5e6B85Fd9E253a873e33E6
__________________________________________________
✨  Done in 37.29s.
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
❯ yarn hardhat verify --network ropsten 0x3311bAcC036f0007638CF63820a1bdeE00903678
yarn run v1.22.15
$ /Users/tobias/Code/encode_bootcamp/08-Tokenized-Votes/Project/node_modules/.bin/hardhat verify --network ropsten 0x3311bAcC036f0007638CF63820a1bdeE00903678
Nothing to compile
No need to generate any newer typings.
Error in plugin @nomiclabs/hardhat-etherscan: Contract source code already verified
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
