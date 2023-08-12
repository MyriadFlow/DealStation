/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract DealStationTicket is Context, ERC721Enumerable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;

  string public baseURI;
  address public owner;
  uint256 public saleprice;

  /// @dev mapping for token URIs
  mapping(uint256 => string) private _tokenURIs;

  event AssetCreated(
    uint256 indexed tokenID,
    address indexed creator,
    string indexed metaDataURI
  );

  modifier onlyOwner() {
    require(owner == _msgSender(), "DealStationTicket: You are not the owner!");
    _;
  }

  constructor(
    string memory _intialURI,
    uint256 _saleprice
  ) ERC721("DEALSTATION", "DSN") {
    baseURI = _intialURI;
    owner = _msgSender();
    saleprice = _saleprice;
  }

  /// @dev only the creator role can issue the token
  function mintTicket(
    string memory metadataURI
  ) external payable returns (uint256) {
    require(msg.value >= saleprice, "DealStationTicket : Not enough Eth!");
    _tokenIdTracker.increment();
    uint256 currentTokenID = _tokenIdTracker.current();
    _safeMint(_msgSender(), currentTokenID);
    _setTokenURI(currentTokenID, metadataURI);
    emit AssetCreated(currentTokenID, _msgSender(), metadataURI);
    return currentTokenID;
  }

  function setOwner(address _owner) external onlyOwner {
    owner = _owner;
  }

  function withdraw(address reciever) external onlyOwner {
    // get the balance of the contract
    (bool callSuccess, ) = payable(reciever).call{value: address(this).balance}(
      ""
    );
    require(callSuccess, "DealStationTicket: Withdrawal failed");
  }

  function setSaleprice(uint256 _saleprice) external onlyOwner {
    saleprice = _saleprice;
  }

  function setbaseUri(string memory _uri) external onlyOwner {
    baseURI = _uri;
  }

  function _setTokenURI(
    uint256 tokenId,
    string memory _tokenURI
  ) internal virtual {
    require(_exists(tokenId), "DealStationTicket: Non-Existent Asset");
    _tokenURIs[tokenId] = _tokenURI;
  }

  /** Getter Functions **/

  function tokenURI(
    uint256 tokenId
  ) public view virtual override returns (string memory) {
    require(_exists(tokenId), "DealStationTicket: Non-Existent Asset");
    if (bytes(_tokenURIs[tokenId]).length == 0) {
      string memory _tokenUri = _baseURI(); //ERC721
      return _tokenUri;
    } else {
      return _tokenURIs[tokenId];
    }
  }

  function _baseURI() internal view override returns (string memory) {
    return baseURI;
  }

  /// @dev only minting  can happen
  /// token transfer are restricted
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId,
    uint256 batchSize
  ) internal virtual override(ERC721Enumerable) {
    require(from == address(0), "DealStationTicket : Invalid Process!");
    super._beforeTokenTransfer(from, to, tokenId, batchSize);
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
