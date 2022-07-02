import { ethers } from "ethers";
import { getSignerProvider, getWallet } from "./utils";
import * as myTokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { MyToken } from "../typechain";

async function main() {
  const myTokenContractAddress = process.argv[2];
  if (!myTokenContractAddress) {
    throw new Error("MyToken contract address needs to be specified.");
  }
  const receiverAddress = process.argv[3];
  if (!receiverAddress) {
    throw new Error(
      "Address to delegate voting power/tokens to needs to be specified."
    );
  }
  const amount = process.argv[4];
  if (!amount) {
    throw new Error("Amount of tokens to be delegated needs to be specified.");
  }
  const network = process.argv[5];
  if (!network) {
    throw new Error("Network needs to be specified.");
  }

  console.log("Connecting to provider...");
  const wallet = getWallet();
  if (wallet.address !== receiverAddress) {
    throw new Error("Only self delegation is allowed.");
  }
  const { signer } = getSignerProvider(wallet, network);

  console.log(
    `Attaching to Token contract address ${myTokenContractAddress}...`
  );
  const myTokenContract = new ethers.Contract(
    myTokenContractAddress,
    myTokenJson.abi,
    signer
  ) as MyToken;

  const mintTx = await myTokenContract.mint(
    receiverAddress,
    ethers.utils.parseEther(amount)
  );
  await mintTx.wait();
  console.log(`Successfully minted ${amount}!`);
  const delegateTx = await myTokenContract.delegate(receiverAddress);
  await delegateTx.wait();
  const postDelegateVotePower = await myTokenContract.getVotes(receiverAddress);
  console.log(
    `Address ${receiverAddress} successfully self-delegated itself ${amount} of voting power`
  );
  console.log(
    `Current voting power for address ${receiverAddress} is ${Number(
      ethers.utils.formatEther(postDelegateVotePower)
    )}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
