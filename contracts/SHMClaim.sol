// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract SHMClaim is Ownable, Pausable, EIP712 {
    using ECDSA for bytes32;

    IERC20 public immutable token;
    address public rewardSigner;
    mapping(address => mapping(uint256 => bool)) public claimed;

    bytes32 private constant REWARD_TYPEHASH = keccak256("Reward(address account,uint256 amount,uint256 nonce,uint256 expiresAt)");

    event RewardClaimed(address indexed account, uint256 amount, uint256 nonce);
    event RewardSignerUpdated(address indexed signer);

    constructor(address token_, address signer_) Ownable(msg.sender) EIP712("SHM Rewards", "1") {
        require(token_ != address(0) && signer_ != address(0), "invalid address");
        token = IERC20(token_);
        rewardSigner = signer_;
    }

    function claim(uint256 amount, uint256 nonce, uint256 expiresAt, bytes calldata signature) external whenNotPaused {
        require(block.timestamp <= expiresAt, "proof expired");
        require(!claimed[msg.sender][nonce], "proof already claimed");
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(REWARD_TYPEHASH, msg.sender, amount, nonce, expiresAt)));
        require(digest.recover(signature) == rewardSigner, "invalid proof");
        claimed[msg.sender][nonce] = true;
        require(token.transfer(msg.sender, amount), "transfer failed");
        emit RewardClaimed(msg.sender, amount, nonce);
    }

    function setRewardSigner(address signer_) external onlyOwner {
        require(signer_ != address(0), "invalid signer");
        rewardSigner = signer_;
        emit RewardSignerUpdated(signer_);
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
    function rescue(uint256 amount, address to) external onlyOwner { require(token.transfer(to, amount), "transfer failed"); }
}
