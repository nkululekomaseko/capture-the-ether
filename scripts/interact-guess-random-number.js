const { ethers } = require("hardhat");
const guessRandomNumberABI = require("../external-contract-ABIs/guess-random-number.json");

const {
  ALCHEMY_API_KEY,
  PRIVATE_KEY,
  GUESS_RANDOM_NUMBER_CONTRACT_ADDRESS,
} = process.env;

const alchemyProvider = new ethers.providers.AlchemyProvider(
  "ropsten",
  ALCHEMY_API_KEY
);

const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

const guessNumberContract = new ethers.Contract(
  GUESS_RANDOM_NUMBER_CONTRACT_ADDRESS,
  guessRandomNumberABI,
  signer
);

const contractOptions = { value: ethers.utils.parseEther("1.0") };

const main = async () => {
  const numberToGuess = await alchemyProvider.getStorageAt(
    GUESS_RANDOM_NUMBER_CONTRACT_ADDRESS,
    0
  );
  if (numberToGuess < 0) {
    console.log("Can't find target value... Exiting");
    return;
  } else {
    console.log(`Target Value Found: ${numberToGuess}\n\n`);
  }
  console.log("Calling the 'guess(n)' function...\n");
  const tx = await guessNumberContract.guess(numberToGuess, contractOptions);

  console.log(
    "Waiting for mining to complete...\n",
    `Transaction: ${JSON.stringify(tx, null, 2)}`
  );
  await tx.wait();

  console.log("Transaction complete!");
};

main();
