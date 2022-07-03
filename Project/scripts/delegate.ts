import { ethers } from "hardhat";
import { getSignerProvider, getWallet } from "./utils";
import * as myTokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { MyToken } from "../typechain";

async function main() {
  const myTokenContractAddress = process.argv[2];
  if (
    !myTokenContractAddress ||
    !ethers.utils.isAddress(myTokenContractAddress)
  ) {
    throw new Error("MyToken contract address needs to be specified.");
  }
  const receiverAddress = process.argv[3];
  if (!receiverAddress || !ethers.utils.isAddress(receiverAddress)) {
    throw new Error(
      "Address to delegate voting power/tokens to needs to be specified."
    );
  }

  const network = process.argv[4];
  if (!network) {
    throw new Error("Network needs to be specified.");
  }

  console.log("Connecting to provider...");
  const wallet = getWallet();

  const { signer } = getSignerProvider(wallet, network);

  console.log(
    `Attaching to Token contract address ${myTokenContractAddress}...`
  );
  const myTokenContract = new ethers.Contract(
    myTokenContractAddress,
    myTokenJson.abi,
    signer
  ) as MyToken;

  const priorDelegateVotePower = await myTokenContract.getVotes(
    receiverAddress
  );

  const delegateTx = await myTokenContract.delegate(receiverAddress);
  await delegateTx.wait();

  const postDelegateVotePower = await myTokenContract.getVotes(receiverAddress);

  const isSelfDelegation = wallet.address === receiverAddress;

  let outputString = `${isSelfDelegation ? "Self-" : ""}Delegation:\n`;
  outputString += `Address ${signer.address} successfully delegated voting power to ${receiverAddress}`;
  outputString += `${isSelfDelegation ? " to self" : ""}\n`;
  outputString += `Current voting power for address ${receiverAddress} is ${ethers.utils.formatEther(
    postDelegateVotePower
  )}, was ${ethers.utils.formatEther(priorDelegateVotePower)}`;

  console.log(outputString);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
