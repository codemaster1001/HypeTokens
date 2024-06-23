import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HypeNFTV2Module = buildModule("HypeNFTV2Module", (m) => {
  const HypeCoinAddress = "0x142dd3c2d1fDDF77216c5AA7eAde4FdCf072efA9";
  const nftV2 = m.contract("HypeNFTV2", [HypeCoinAddress]);
  return { nftV2 };
});

export default HypeNFTV2Module;
