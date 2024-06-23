// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HypeNFT is ERC721Enumerable, Ownable{
    uint256 public nextTokenId;
    uint256 public constant nftPrice = 10 ** 17; // 1 HypeNFT = 0.1 ETH

    constructor() ERC721("HypeNFT", "HypeNFT") Ownable(msg.sender){
        nextTokenId = 1;
    }

    function mint(uint256 _amount) external payable {
        if(_amount == 0) revert();
        uint256 requiredETH = _amount * nftPrice;
        if(msg.value < requiredETH) revert();

        for (uint256 i = 0; i < _amount; i++) {
            _safeMint(msg.sender, nextTokenId);
            nextTokenId += 1;
        }
        payable(owner()).transfer(msg.value);
        if(msg.value > requiredETH) payable(msg.sender).transfer(msg.value - requiredETH);
    }

    function getNextTokenId() external view returns (uint256) {
        return nextTokenId;
    }

    function tokensOwnedByAddr(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }

        return tokenIds;
    }

    receive() external payable { }
}
