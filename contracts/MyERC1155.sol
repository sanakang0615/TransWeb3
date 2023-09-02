// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyERC1155 is ERC1155, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC1155("url") {}

    function mintToken(address account, uint256 amount) external onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        _mint(account, tokenId, amount, "");

        return tokenId;
    }

    // function setURI(string memory newuri) external onlyOwner {
    //     _setURI(newuri);
    // }
}
