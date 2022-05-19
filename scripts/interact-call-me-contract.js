const { ethers, network } = require("hardhat");
const callMeContractABI = require("../external-contract-ABIs/call-me.json");

const { ALCHEMY_API_KEY, PRIVATE_KEY, CALL_ME_CONTRACT_ADDRESS } = process.env;

const alchemyProvider = new ethers.providers.AlchemyProvider(
  "ropsten",
  ALCHEMY_API_KEY
);

const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

const callMeContract = new ethers.Contract(
  CALL_ME_CONTRACT_ADDRESS,
  callMeContractABI,
  signer
);

const main = async () => {
  console.log("Calling the 'callme()' function...");
  const tx = await callMeContract.callme();
  console.log(
    "Waiting for mining to complete...\n",
    `Transaction: ${JSON.stringify(tx, null, 2)}`
  );
  await tx.wait();
  console.log("Transaction complete!");
};

main();
