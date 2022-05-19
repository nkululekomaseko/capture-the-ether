const { ethers } = require("hardhat");
const chooseNicknameABI = require("../external-contract-ABIs/choose-nickname.json");

const {
  ALCHEMY_API_KEY,
  PRIVATE_KEY,
  CHOOSE_NICKNAME_CONTRACT_ADDRESS,
} = process.env;

const alchemyProvider = new ethers.providers.AlchemyProvider(
  "ropsten",
  ALCHEMY_API_KEY
);

const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

const chooseNicknameContract = new ethers.Contract(
  CHOOSE_NICKNAME_CONTRACT_ADDRESS,
  chooseNicknameABI,
  signer
);

const nicknameBytes32 = ethers.utils.formatBytes32String("nkululekomaseko");

const main = async () => {
  console.log("Calling the 'setNickname' function...");
  const tx = await chooseNicknameContract.setNickname(nicknameBytes32);
  console.log(
    "Waiting for mining to complete...\n",
    `Transaction: ${JSON.stringify(tx, null, 2)}`
  );
  await tx.wait();
  console.log("Transaction complete!");
};

main();
