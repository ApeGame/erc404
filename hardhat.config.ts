import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "./scripts/index"

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    coq: {
      url: "https://shanghai-inner-rpc.ankr.com/all/coq_testnet/rpc",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    bsctestnet: {
      url: "https://bsc-testnet-rpc.publicnode.com",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      ethereum: process.env.ETH_API_KEY ?? "",
      bscTestnet: process.env.BSCSCAN_API_KEY ?? "",
      coq: process.env.ETH_API_KEY ?? "",
    },
    customChains: [
      {
        network: "coq",
        chainId: 12077,
        urls: {
          apiURL: "https://testnetscan.ankr.com/api",
          browserURL: "https://testnetscan.ankr.com",
        },
      },
    ],
  },
};

export default config;
