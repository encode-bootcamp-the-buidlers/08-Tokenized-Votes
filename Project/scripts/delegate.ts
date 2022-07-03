import { ethers } from "ethers";
import { getSignerProvider, getWallet } from "./utils";
import * as myTokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { MyToken } from "../typechain";

async function main() {
  const myTokenContractAddress = process.argv[2];
  if (!myTokenContractAddress) {
    throw new Error("MyToken contract address needs to be specified.");
  }
  const amount = process.argv[3];
  if (!amount) {
    throw new Error("Amount of tokens to be delegated needs to be specified.");
  }
  const network = process.argv[4];
  if (!network) {
    throw new Error("Network needs to be specified.");
  }

  console.log("Connecting to provider...");
  const wallet = getWallet();
  const { signer } = getSignerProvider(wallet, network);

  // If delegatee address is not specified, we will default to self-delegation
  const delegateeAddress = process.argv[5] || wallet.address;

  console.log(
    `Attaching to Token contract address ${myTokenContractAddress}...`
  );
  const myTokenContract = new ethers.Contract(
    myTokenContractAddress,
    myTokenJson.abi,
    signer
  ) as MyToken;

  const mintTx = await myTokenContract.mint(
    delegateeAddress,
    ethers.utils.parseEther(amount)
  );
  await mintTx.wait();
  console.log(`Successfully minted ${amount}!`);
  const delegateTx = await myTokenContract.delegate(delegateeAddress);
  await delegateTx.wait();
  const postDelegateVotePower = await myTokenContract.getVotes(
    delegateeAddress
  );
  console.log(
    `Address ${delegateeAddress} successfully self-delegated itself ${amount} of voting power`
  );
  console.log(
    `Current voting power for address ${delegateeAddress} is ${Number(
      ethers.utils.formatEther(postDelegateVotePower)
    )}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
