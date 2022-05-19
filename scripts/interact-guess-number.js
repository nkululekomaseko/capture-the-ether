const { ethers } = require("hardhat");
const guessNumberABI = require("../external-contract-ABIs/guess-number.json");

const {
  ALCHEMY_API_KEY,
  PRIVATE_KEY,
  GUESS_NUMBER_CONTRACT_ADDRESS,
} = process.env;

const alchemyProvider = new ethers.providers.AlchemyProvider(
  "ropsten",
  ALCHEMY_API_KEY
);

const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

const guessNumberContract = new ethers.Contract(
  GUESS_NUMBER_CONTRACT_ADDRESS,
  guessNumberABI,
  signer
);

const contractOptions = { value: ethers.utils.parseEther("1.0") };
const numberToGuess = 42;

const main = async () => {
  console.log("Calling the 'guess(n)' function...");
  const tx = await guessNumberContract.guess(numberToGuess, contractOptions);

  console.log(
    "Waiting for mining to complete...\n",
    `Transaction: ${JSON.stringify(tx, null, 2)}`
  );
  await tx.wait();

  console.log("Transaction complete!");
};

main();
