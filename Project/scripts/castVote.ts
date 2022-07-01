import { ethers } from "ethers";
import { getSignerProvider, getWallet } from "./utils";
import * as ballotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import * as myTokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { CustomBallot, MyToken } from "../typechain";

async function main() {
  const BASE_VOTE_POWER = 5;
  const BASE_MINT_AMOUNT = 20;

  const ballotContractAddress = process.argv[2];
  if (!ballotContractAddress) {
    throw new Error("Ballot contract address needs to be specified.");
  }
  const myTokenContractAddress = process.argv[3];
  if (!myTokenContractAddress) {
    throw new Error("MyToken contract address needs to be specified.");
  }
  const proposalIndexToVote = process.argv[4];
  if (!proposalIndexToVote) {
    throw new Error("Proposal index to vote on needs to be specified.");
  }
  const network = process.argv[5];
  if (!network) {
    throw new Error("Network needs to be specified.");
  }

  console.log("Connecting to provider...");
  const wallet = getWallet();
  const { signer } = getSignerProvider(wallet, network);
  const signerAddress = await signer.getAddress();

  console.log(
    `Attaching to Ballot contract address ${ballotContractAddress}...`
  );
  const ballotContract = new ethers.Contract(
    ballotContractAddress,
    ballotJson.abi,
    signer
  ) as CustomBallot;
  console.log(
    `Attaching to MyToken contract address ${myTokenContractAddress}...`
  );
  const myTokenContract = new ethers.Contract(
    myTokenContractAddress,
    myTokenJson.abi,
    signer
  ) as MyToken;

  const previousBalanceTx = await myTokenContract.balanceOf(signerAddress);
  console.log(
    `Minting tokens for address ${signerAddress}, previous balance : ${ethers.utils.formatEther(
      previousBalanceTx
    )} tokens...`
  );
  const mintTx = await myTokenContract.mint(
    signerAddress,
    ethers.utils.parseEther(BASE_MINT_AMOUNT.toFixed(18))
  );
  await mintTx.wait();
  const newBalanceTx = await myTokenContract.balanceOf(signerAddress);
  console.log(
    `Minted tokens for address ${signerAddress}, new balance : ${ethers.utils.formatEther(
      newBalanceTx
    )} tokens.`
  );

  console.log(
    "Self delegating to track voting power and enable checkpoints..."
  );
  const previousVotingPower = await ballotContract.votingPower();
  console.log(`Previous voting power : ${previousVotingPower}`);
  const delegateTx = await myTokenContract.delegate(signerAddress);
  await delegateTx.wait();
  const newVotingPower = await ballotContract.votingPower();
  console.log(`New voting power : ${newVotingPower}`);

  const currentProposalToVote = await ballotContract.proposals(
    proposalIndexToVote
  );
  console.log(
    `Proposal to vote on has currently ${currentProposalToVote.voteCount} votes.`
  );
  const votingPowerBefore = await ballotContract.votingPower();
  console.log(
    `${signerAddress} has ${ethers.utils.formatEther(
      votingPowerBefore
    )} voting power before voting.`
  );
  console.log(`Casting vote on proposal index ${proposalIndexToVote}...`);
  const voteTx = await ballotContract.vote(
    proposalIndexToVote,
    ethers.utils.parseEther(BASE_VOTE_POWER.toFixed(18))
  );

  const proposalUpdated = await ballotContract.proposals(proposalIndexToVote);
  console.log(
    `Proposal to vote on has now ${proposalUpdated.voteCount} votes.`
  );
  const votingPowerAfter = await ballotContract.votingPower();
  console.log(
    `Account ${signerAddress} has now ${ethers.utils.formatEther(
      votingPowerAfter
    )} voting power.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
