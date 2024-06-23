// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HypeCoin is ERC20, Ownable {

    uint constant public COIN_PRICE = 10 ** 16; // 1 HC = 0.01  ETH

    constructor(uint _totalySupply) ERC20("HypeCoin", "HC") Ownable(msg.sender) {
        _mint(msg.sender, _totalySupply);
    }

    function buy(uint _amount) external payable {
        if(balanceOf(owner()) < _amount) revert();

        uint price = _amount * COIN_PRICE / 10 ** 18;
        if(msg.value < price) revert();
        _transfer(owner(), msg.sender, _amount);
        if (msg.value > price) payable(msg.sender).transfer(msg.value - price);
    }

    function claim() external onlyOwner {
        if (address(this).balance == 0) revert();
        uint value = address(this).balance;
        payable(owner()).transfer(value);
    }

    receive() external payable { }

} 