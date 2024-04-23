import { constants } from 'ethers';
import { types, task } from "hardhat/config";


// hardhat deploy --name test --symbol TEST --network coq
task("deploy", "deploy erc404")
  .addParam("name", "name of erc404", "", types.string)
  .addParam("symbol", "symbol of erc404", "", types.string)
  .addParam("uri", "symbol of erc404", "", types.string)
  .addParam("permax", "the maximum holding limit of NFTs for a address.", 1, types.int)
  .addParam("nftuint", "NFT's smallest unit", 10000, types.int)
  .addParam("mintlimit", "mint nft limit", 10000, types.int)
  .addParam("staketoken", "stake token address", constants.AddressZero, types.string)
  .addParam("ratio", "How many ERC404 tokens can be exchanged for one stake token", 1, types.float)
  .setAction(async (taskArgs, hre) => {
    const name: string = taskArgs.name;
    const symbol: string = taskArgs.symbol;
    const uri: string = taskArgs.uri;
    const permax: number = taskArgs.permax;
    const nftuint: number = taskArgs.nftuint;
    const mintlimit: number = taskArgs.mintlimit;
    const staketoken: string = taskArgs.staketoken;
    const ratio: number = taskArgs.ratio;

    if (!hre.ethers.utils.isAddress(staketoken)) {
      console.log("invalid stake token")
      return
    }

    const ERC404StakeFactory = await hre.ethers.getContractFactory("ERC404Stake");


    const ERC404StakeProxy = await hre.upgrades.deployProxy(
      ERC404StakeFactory,
      [name, symbol, uri, permax, nftuint, mintlimit, staketoken, ratio * 10000],
      {
        initializer: "initialize",
      }
    );
    await ERC404StakeProxy.deployed();
    console.log(`ERC404Stake deployed: ${ERC404StakeProxy.address}`);
  })