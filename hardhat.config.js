// Load environment variables from .env (create one at project root)
//require("dotenv").config();
require("@chainlink/env-enc").config();
require("@nomicfoundation/hardhat-toolbox");

const { ALCHEMY_API_KEY, INFURA_API_KEY, PRIVATE_KEY, PRIVATE_KEY_1, ETHERSCAN_API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      // Local Hardhat network. Optionally enable forking by setting FORK=true and providing ALCHEMY_API_KEY
      chainId: 31337,
      // forking: {
      //   url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      //   enabled: process.env.FORK === "true",
      // },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      // Example using Alchemy; you can also use Infura or other providers
      url: ALCHEMY_API_KEY
        ? `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
        : INFURA_API_KEY
        ? `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
        : undefined,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY,PRIVATE_KEY_1] : [],
      chainId: 11155111,
    },
    mainnet: {
      url: ALCHEMY_API_KEY
        ? `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`
        : INFURA_API_KEY
        ? `https://mainnet.infura.io/v3/${INFURA_API_KEY}`
        : undefined,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    // API key for contract verification (Etherscan, Polygonscan, etc.)
    apiKey: ETHERSCAN_API_KEY || "",
  },
};
