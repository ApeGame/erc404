import { constants } from 'ethers';
import { types, task } from "hardhat/config";

task("verify-contract", "verify erc404 contract")
    .addParam("contract", "erc404 contract", "", types.string)
    .addParam("name", "name of erc404", "", types.string)
    .addParam("symbol", "symbol of erc404", "", types.string)
    .addParam("uri", "symbol of erc404", "", types.string)
    .addParam("permax", "the maximum holding limit of NFTs for a address.", 1, types.int)
    .addParam("nftuint", "NFT's smallest unit", 10000, types.int)
    .addParam("mintlimit", "mint nft limit", 10000, types.int)
    .addParam("staketoken", "stake token address", constants.AddressZero, types.string)
    .addParam("ratio", "How many ERC404 tokens can be exchanged for one stake token", 1, types.float)
    .setAction(async (taskArgs, hre) => {
        const contract: string = taskArgs.contract;

        if (!hre.ethers.utils.isAddress(contract)) {
            console.log("invalid factory contract")
            return
        }

        await hre.run("verify:verify", {
            address: contract,
            constructorArguments: [],
            contract: "contracts/ERC404Stake.sol:ERC404Stake",
        });
    })