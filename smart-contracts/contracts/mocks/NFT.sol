// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFT is ERC721Enumerable {
  uint256 public counter = 0;

  constructor() ERC721("MY TOKEN", "MTK") {}

  function mintNFT() external returns (uint256) {
    counter++;
    _safeMint(msg.sender, counter);
    return counter;
  }
}
