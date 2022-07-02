import "dotenv/config";
import { ethers } from "ethers";
import * as myTokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import * as customBalletJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import { getSignerProvider, getWallet } from "./utils";

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  const BASE_MINT_AMOUNT = 20;
  const network = process.argv[2];

  const wallet = getWallet();

  const { signer } = getSignerProvider(wallet, network);
  const signerAddress = await signer.getAddress();
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);

  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  console.log("__________________________________________________");

  console.log("Deploying MyToken contract");
  const myTokenFactory = new ethers.ContractFactory(
    myTokenJson.abi,
    myTokenJson.bytecode,
    signer
  );
  const myTokenContract = await myTokenFactory.deploy();

  console.log("Awaiting confirmations");
  await myTokenContract.deployed();

  console.log(`Contract deployed at ${myTokenContract.address}`);

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

  const delegateTx = await myTokenContract.delegate(signer.address);
  await delegateTx.wait();
  console.log("Completed");

  console.log("__________________________________________________");

  console.log("Deploying CustomBallot contract");

  console.log("Proposals: ");
  const proposals = process.argv.slice(3);
  if (proposals.length < 2) throw new Error("Not enough proposals provided");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  const customBallotFactory = new ethers.ContractFactory(
    customBalletJson.abi,
    customBalletJson.bytecode,
    signer
  );
  const customBallotContract = await customBallotFactory.deploy(
    convertStringArrayToBytes32(proposals),
    myTokenContract.address
  );

  console.log("Awaiting confirmations");
  await customBallotContract.deployed();

  console.log("Completed");
  console.log(`Contract deployed at ${customBallotContract.address}`);

  console.log("__________________________________________________");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
