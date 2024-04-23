//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {IERC20} from "./interfaces/IERC20.sol";
import {ERC404} from "./ERC404.sol";

contract ERC404Stake is ERC404, OwnableUpgradeable {
    string public uri;

    // The ERC20 address used for accepting deposits.
    // If it's the zero address, then it's the native token.
    address public stakeToken;

    // The exchange ratio of stake tokens to ERC404 tokens during staking.
    /// @dev ? stake Token = (? * ratio / 10000) ERC404 token
    uint96 public ratio;

    // error
    error TranferFailed();

    // event
    event StakeChanged(address indexed user, uint256 indexed amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        string memory uri_,
        uint96 perMax_,
        uint256 nftUints_,
        uint128 mintLimit_,
        address stakeToken_,
        uint96 ratio_
    ) public initializer {
        __ERC404_init(name_, symbol_, perMax_, nftUints_, mintLimit_);
        __Ownable_init(msg.sender);
        uri = uri_;
        stakeToken = stakeToken_;
        ratio = ratio_;
    }

    function tokenURI(uint256 id_)
        public
        view
        override
        returns (string memory)
    {
        if (address(0) == _getOwnerOf(id_)) {
            revert NotFound();
        }

        return
            bytes(uri).length > 0
                ? string.concat(uri, Strings.toString(id_))
                : "";
    }

    function stake(uint256 value_) public payable {
        if (stakeToken == address(0)) {
            uint256 value = (msg.value * ratio) / 10000;
            _mintERC20(msg.sender, value);
        } else {
            if (
                !IERC20(stakeToken).transferFrom(
                    msg.sender,
                    address(this),
                    value_
                )
            ) {
                revert TranferFailed();
            }
            uint256 value = (value_ * ratio) / 10000;
            _mintERC20(msg.sender, value);
        }
    }

    function setMintLimit(uint128 limit_) external onlyOwner {
        _setMintLimit(limit_);
    }

    function setURI(string calldata uri_) external onlyOwner {
        uri = uri_;
    }

    function unStake(uint256 amount_) public {
        _burnERC20(msg.sender, amount_);

        uint256 value = (amount_ * 10000) / ratio;
        if (stakeToken == address(0)) {
            (bool ok, ) = msg.sender.call{value: value}("");
            if (!ok) {
                revert TranferFailed();
            }
        } else {
            if (!IERC20(stakeToken).transfer(msg.sender, value)) {
                revert TranferFailed();
            }
        }
    }

    function _afterTokenTransfer(
        address from_,
        address to_,
        uint256
    ) internal override {
        if (from_ != address(0)) {
            emit StakeChanged(from_, (erc20BalanceOf(from_) * 10000) / ratio);
        }
        if (to_ != address(0)) {
            emit StakeChanged(to_, (erc20BalanceOf(to_) * 10000) / ratio);
        }
    }
}
