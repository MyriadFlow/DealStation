require("dotenv").config();
import dotenv from "dotenv"
dotenv.config();
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-truffle5"
import "@nomiclabs/hardhat-waffle"
import "hardhat-gas-reporter"
import "solidity-coverage"
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import { task } from "hardhat/config"

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// API_KEY & PRIVATE_KEY
const MATICMUM_RPC_URL = process.env.MATICMUM_RPC_URL 
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL 
const LINEA_GOERLI_RPC_URL = process.env.LINEA_GOERLI_RPC_URL 


const MNEMONIC = process.env.MNEMONIC 
const PRIVATE_KEY = process.env.PRIVATE_KEY

const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY 
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY 
const LINEA_GOERLI_API_KEY = process.env.LINEA_GOERLI_API_KEY 


module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0, // workaround from https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136 . Remove when that issue is closed.
    },
    maticmum: {
      networkId: 80001,
      url: MATICMUM_RPC_URL,
      // accounts: [`0x${ETH_PRIVATE_KEY}`],
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
    sepolia: {
      networkId: 11155111,
      url: SEPOLIA_RPC_URL,
      // accounts : [PRIVATE_KEY],
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
    lineaGoerli :{
      networkId: 59140,
      url: LINEA_GOERLI_RPC_URL,
      // accounts : [PRIVATE_KEY],
      accounts: {
        mnemonic: MNEMONIC,
      },      
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      polygonMumbai : POLYGONSCAN_API_KEY,
      sepolia : ETHERSCAN_API_KEY,
      lineaGoerli : LINEA_GOERLI_API_KEY
    },
      customChains: [
    {
      network: "lineaGoerli",
      chainId: 59140,
      urls: {
        apiURL: "https://linea-goerli.infura.io/v3/7b22b86af01c43a88ffda434a224edc4",
        browserURL: "https://goerli.lineascan.build/"
      }
    }
  ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 20000,
  },
};