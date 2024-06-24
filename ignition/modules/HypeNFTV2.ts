import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * @notice Before deploying you have to set the correct HypeCoin address as a parameter in contructor function
 */
const HypeNFTV2Module = buildModule("HypeNFTV2Module", (m) => {
  const HypeCoinAddress = "0x142dd3c2d1fDDF77216c5AA7eAde4FdCf072efA9"; // This is a temparary address of deployed HypeCoin Address.
  const nftV2 = m.contract("HypeNFTV2", [HypeCoinAddress]);
  return { nftV2 };
});

export default HypeNFTV2Module;
