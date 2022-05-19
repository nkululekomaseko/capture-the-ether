const { ethers } = require("hardhat");
const guessNumberABI = require("../external-contract-ABIs/guess-number.json");

const {
  ALCHEMY_API_KEY,
  PRIVATE_KEY,
  GUESS_SECRET_NUMBER_CONTRACT_ADDRESS,
} = process.env;

const alchemyProvider = new ethers.providers.AlchemyProvider(
  "ropsten",
  ALCHEMY_API_KEY
);

const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

const guessNumberContract = new ethers.Contract(
  GUESS_SECRET_NUMBER_CONTRACT_ADDRESS,
  guessNumberABI,
  signer
);

const contractOptions = { value: ethers.utils.parseEther("1.0") };

const targetHashToGuess =
  "0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365";

let numberToGuess = -1;

// Brute force guess:
for (let i = 0; i <= 256; i++) {
  const numberToByte = ethers.utils.toUtf8Bytes(i);
  if (ethers.utils.keccak256(i) === targetHashToGuess) {
    numberToGuess = i;
  }
}

const main = async () => {
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
