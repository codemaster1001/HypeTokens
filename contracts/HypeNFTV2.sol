// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract HypeNFTV2 is ERC721Enumerable, Ownable {
    IERC20 public hypeCoin;
    uint256 public nextTokenId;
    uint256 public constant nftPrice = 0.1 ether; // 1 HypeNFT = 0.1 ETH
    mapping(uint256 => uint256) public lastClaimed;
    uint256 public constant DAILY_REWARD = 1 * 10 ** 18;

    constructor(
        address _coinAddress
    ) ERC721("HypeNFT", "HypeNFT") Ownable(msg.sender) {
        nextTokenId = 1;
        hypeCoin = IERC20(_coinAddress);
    }

    function mint(uint256 _amount) external payable {
        if (_amount == 0) revert("Insufficient amount");
        uint256 requiredETH = _amount * nftPrice;
        if (msg.value < requiredETH) revert("Insufficient ETH to mint NFT");

        for (uint256 i = 0; i < _amount; i++) {
            _safeMint(msg.sender, nextTokenId);
            lastClaimed[nextTokenId] = block.timestamp;
            nextTokenId += 1;
        }
        payable(owner()).transfer(msg.value);
        if (msg.value > requiredETH)
            payable(msg.sender).transfer(msg.value - requiredETH);
    }

    function getNextTokenId() external view returns (uint256) {
        return nextTokenId;
    }

    function tokensOwnedByAddr(
        address _owner
    ) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }

        return tokenIds;
    }

    //5 HypeCoin (with decimals 18) = 1 HypeNFT
    //before calling this function, user have to approve to this contract first
    function mintWithHypeCoin(uint256 _tokenAmount) external {
        uint256 _nftPrice = 5 * 10 ** 18;
        if (_tokenAmount < _nftPrice) revert("Insufficient amount to mint NFT");

        uint256 remainder = _tokenAmount % _nftPrice;
        uint256 nftCount = (_tokenAmount - remainder) / _nftPrice;
        uint256 requiredTokenAmount = nftCount * _nftPrice;

        uint256 balance = hypeCoin.balanceOf(msg.sender);
        uint256 allowance = hypeCoin.allowance(msg.sender, address(this));
        if (balance < requiredTokenAmount) revert("Insufficient token balance");
        if (allowance < requiredTokenAmount) revert("Allowance too low");

        if (
            hypeCoin.transferFrom(
                msg.sender,
                address(this),
                requiredTokenAmount
            ) == false
        ) revert("Error while transfering HypeCoin");
        for (uint256 i = 0; i < nftCount; i++) {
            _safeMint(msg.sender, nextTokenId);
            lastClaimed[nextTokenId] = block.timestamp;
            nextTokenId += 1;
        }
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721, IERC721) {
        if (from != address(0)) {
            _collectReward(tokenId);
        }
        super.transferFrom(from, to, tokenId);
    }

    function _collectReward(uint256 tokenId) private {
        uint256 timeHeld = block.timestamp - lastClaimed[tokenId];
        uint256 rewards = (timeHeld / 1 days) * DAILY_REWARD;
        hypeCoin.transfer(ownerOf(tokenId), rewards);
        lastClaimed[tokenId] = block.timestamp;
    }

    function collect() public {
        uint256[] memory tokenIds = tokensOwnedByAddr(msg.sender);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _collectReward(tokenIds[i]);
        }
    }

    receive() external payable {}
}
