//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ISemaphore.sol";

interface ERC721 {
    function balanceOf(address owner) external view returns (uint256 balance);
}

contract Feedback {
    ISemaphore public semaphore;

    address public nftAddress = 0xF268C79d48E168d09e2e3A406b5E85337C39d226;

    uint256 public groupId;

    constructor(address semaphoreAddress, uint256 _groupId) {
        semaphore = ISemaphore(semaphoreAddress);
        groupId = _groupId;
        semaphore.createGroup(groupId, 20, address(this));
    }

    function joinGroup(uint256 identityCommitment) external {
        ERC721 nftContract = ERC721(nftAddress);
        require(nftContract.balanceOf(msg.sender) > 0, "you dont have NFT");
        semaphore.addMember(groupId, identityCommitment);
    }

    function sendFeedback(
        uint256 feedback,
        uint256 merkleTreeRoot,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        semaphore.verifyProof(groupId, merkleTreeRoot, feedback, nullifierHash, groupId, proof);
    }
}
