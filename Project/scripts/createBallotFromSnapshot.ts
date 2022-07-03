import childProcess from "child_process";

async function main() {
  /*
    To create a ballot from a snapshot we trigger the snapshot by self-delegating.
    This is how it the snapshot/checkpoint of the ERC20Votes works, as we can read
    on the comments on the ERC20Votes.sol file
    */
  // Phase 1: Self-delegation
  const myTokenContractAddress = process.argv[2];
  if (!myTokenContractAddress) {
    throw new Error("MyToken contract address needs to be specified.");
  }
  const amount = process.argv[3];
  if (!amount) {
    throw new Error(
      "Amount of tokens to be self-delegated needs to be specified."
    );
  }
  const network = process.argv[4];
  if (!network) {
    throw new Error("Network needs to be specified.");
  }

  const selfDelegate = childProcess.fork(__dirname + "/delegate", [
    myTokenContractAddress,
    amount,
    network,
  ]);

  // Phase 2: deploy ballot

  const deployBallot = childProcess.fork(__dirname + "/deploymentBallot", [
    network,
    myTokenContractAddress,
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
