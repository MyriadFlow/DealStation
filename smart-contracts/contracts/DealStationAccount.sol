// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./Bytecode.sol";

contract DealStationAccount is IERC165, Context, ERC721Holder {
  mapping(uint256 => NFT) public offerNfts;

  struct Offer {
    address holderTokenAddress;
    uint256 holderTokenId;
    uint256 numberOfOfferTokens;
    uint256 lockingPeriod;
  }

  struct NFT {
    address nftAddr;
    uint256 tokenId;
  }

  enum Status {
    NotIntiated,
    Intiated,
    Pending,
    Accepted
  }

  Status public status;
  Offer public offer;

  event StatusInfo(Status indexed state);

  event OfferCreation(
    address indexed contractAddress,
    uint256 indexed tokenId,
    uint256 indexed numberOfOffering
  );

  modifier onlyOwner() {
    require(msg.sender == owner(), "DealStationAccount: Not token owner");
    _;
  }

  function token()
    external
    view
    returns (uint256 chainId, address tokenContract, uint256 tokenId)
  {
    uint256 length = address(this).code.length;
    return
      abi.decode(
        Bytecode.codeAt(address(this), length - 0x60, length),
        (uint256, address, uint256)
      );
  }

  function owner() public view returns (address) {
    (uint256 chainId, address tokenContract, uint256 tokenId) = this.token();
    if (chainId != block.chainid) return address(0);

    return IERC721(tokenContract).ownerOf(tokenId);
  }

  // Update status by passing uint into input
  function setOfferStatus(Status _status) private {
    status = _status;
    emit StatusInfo(status);
  }

  function createOffer(
    address contractAddr, // address of the item which Offerer wants to swap
    uint256 tokenId, // tokenId of the item which Offerer wants to swap
    uint256 amt
  ) external {
    address nftOwner = IERC721(contractAddr).ownerOf(tokenId);
    require(
      nftOwner != address(0),
      "DealStationAccount: This deal cannot be proceeded!"
    );
    offer = Offer(contractAddr, tokenId, amt, 0);
    setOfferStatus(Status.Intiated);
    emit OfferCreation(contractAddr, tokenId, amt);
  }

  function lock(
    address[] memory contractAddr,
    uint256[] memory tokens,
    uint256 _lockingPeriod
  ) public {
    require(
      status == Status.Intiated,
      "DealStationAccount: This deal had not been intiated!"
    );
    uint256 tokenAmount = offer.numberOfOfferTokens;
    require(
      contractAddr.length == tokens.length &&
        contractAddr.length == tokenAmount,
      "DealStationAccount: Wrong inputs , contract Addresses and tokenId's do not match!"
    );
    for (uint256 i = 0; i < tokenAmount; i++) {
      require(
        _msgSender() == IERC721(contractAddr[i]).ownerOf(tokens[i]),
        "DealStationAccount: Deal cannot be proceeded due to ownership mismatching in one of the tokens"
      );
    }
    for (uint256 i = 0; i < tokenAmount; i++) {
      IERC721(contractAddr[i]).transferFrom(
        _msgSender(),
        address(this),
        tokens[i]
      );

      offerNfts[i] = NFT(contractAddr[i], tokens[i]);
    }
    offer.lockingPeriod = block.timestamp + _lockingPeriod;
    setOfferStatus(Status.Pending);
  }

  function acceptOffer() external {
    address contractAddr = offer.holderTokenAddress;
    uint256 _tokenId = offer.holderTokenId;
    require(
      _msgSender() == IERC721(contractAddr).ownerOf(_tokenId),
      "DealStationAccount: You are not the owner, you cannot accept"
    );
    require(
      status == Status.Pending,
      "DealStationAccount: This offer cannot be rolled over!"
    );
    address tokenReciever = owner();
    ///transferring directly to owner
    IERC721(contractAddr).transferFrom(_msgSender(), tokenReciever, _tokenId);
    /// transferring NFT's directly to offer acceptor
    for (uint256 i = 0; i < offer.numberOfOfferTokens; i++) {
      contractAddr = offerNfts[i].nftAddr;
      _tokenId = offerNfts[i].tokenId;

      IERC721(contractAddr).transferFrom(address(this), _msgSender(), _tokenId);
    }
    setOfferStatus(Status.Accepted);
  }

  function offerRollOver() external onlyOwner {
    require(
      status == Status.Pending,
      "DealStationAccount: This offer cannot be rolled over!"
    );
    require(
      block.timestamp > offer.lockingPeriod,
      "DealStationAccount: Deal period had not been completed!"
    );
    for (uint256 i = 0; i < offer.numberOfOfferTokens; i++) {
      address contractAddr = offerNfts[i].nftAddr;
      uint256 _tokenId = offerNfts[i].tokenId;

      IERC721(contractAddr).transferFrom(address(this), _msgSender(), _tokenId);
    }
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(IERC165) returns (bool) {
    if (interfaceId == type(IERC165).interfaceId) return true;
    else return false;
  }
}
