# HypeCoin and HypeNFT Project

This project demonstrates a basic Hardhat use case with ERC20 and ERC721(Enumerable).

## HypeCoin

This is a ERC20.

### buy function

User can buy HypeCoins with ETH.
1 HypeCoin = 0.01 ETH

### claim function

Only Owner can claim ETH from the contract.

## HypeNFT

This is a ERC721Enumerable

### mint function

User can mint any number of HypeNFTs with ETH.
1 HypeNFT = 0.1 ETH

### getNextTokenId function

Any user can get next mintable tokenId.

### tokensOwnedByAddr function

Any user can get all the tokenIds by wallet address.

## HypeNFTV2

This is HypeNFT version 2 with features like minting with HypeCoins and collecting rewards by holding NFTs.

### mintWithHypeCoin function

Users can mint NFT with their HypeCoins.
1 HypeNFT = 5 HypeCoins
Users have to approve their HypeCoins to this contract address before calling this function.

### collect function

Users can collect their rewards after more than one day if they hold our NFTs.
1 NFT can generate 1 HypeCoin per one day.

## Npm commands

Try running some of the following tasks:

```shell

npm install

npm run compile

npm run test

```
