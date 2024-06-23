import { expect } from "chai";
import hre from "hardhat";

describe("HypeCoin", function () {
  let hypeCoin: any;
  let totalSupply = hre.ethers.parseUnits("1000000", 18);
  let owner: any, otherAccount: any;

  beforeEach(async function () {
    hypeCoin = await hre.ethers.deployContract("HypeCoin", [totalSupply]);
    [owner, otherAccount] = await hre.ethers.getSigners();
  });

  describe("Deployment", function () {
    it("Should set the total Supply to 1,000,000 with decimals 18", async function () {
      expect(await hypeCoin.totalSupply()).to.equal(totalSupply);
    });

    it("Balance of the owner should be 1,000,000 with decimals 18", async function () {
      expect(await hypeCoin.balanceOf(owner)).to.equal(totalSupply);
    });
  });

  describe("Buy", function () {
    const tokenAmount = 10n ** 20n;
    const requiredETH = 10n ** 18n;

    it("Should buy 100 token for 1ETH and refund the remaining ETH to buyer", async function () {
      await hypeCoin
        .connect(otherAccount)
        .buy(tokenAmount, { value: hre.ethers.parseEther("30.0") });
      expect(await hypeCoin.balanceOf(otherAccount)).to.equal(tokenAmount);
      expect(await hre.ethers.provider.getBalance(hypeCoin.target)).to.equal(
        requiredETH
      );
    });

    it("Should fail if the ETH is not enough", async function () {
      await expect(
        hypeCoin
          .connect(otherAccount)
          .buy(tokenAmount, { value: hre.ethers.parseEther("0.1") })
      ).to.be.reverted;
    });
  });

  describe("Claim", function () {
    it("Owner claims ETH", async function () {
      await hypeCoin
        .connect(otherAccount)
        .buy(10n ** 20n, { value: hre.ethers.parseEther("30.0") });
      const contractBalance = await hre.ethers.provider.getBalance(
        hypeCoin.target
      );

      await expect(hypeCoin.claim()).to.changeEtherBalances(
        [owner, hypeCoin],
        [contractBalance, -contractBalance]
      );
    });
    it("If user is not owner calls claim, it reverts with error", async function () {
      await hypeCoin
        .connect(otherAccount)
        .buy(10n ** 20n, { value: hre.ethers.parseEther("30.0") });
      await expect(hypeCoin.connect(otherAccount).claim()).to.be.reverted;
    });
  });
});

// We define a fixture to reuse the same setup in every test.
// We use loadFixture to run this setup once, snapshot that state,
// and reset Hardhat Network to that snapshot in every test.
// async function deployOneYearLockFixture() {
//   const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//   const ONE_GWEI = 1_000_000_000;
//   const lockedAmount = ONE_GWEI;
//   const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
//   // Contracts are deployed using the first signer/account by default
//   const [owner, otherAccount] = await hre.ethers.getSigners();
//   const Lock = await hre.ethers.getContractFactory("Lock");
//   const lock = await Lock.deploy(unlockTime, { value: lockedAmount });
//   return { lock, unlockTime, lockedAmount, owner, otherAccount };
// }
// describe("Deployment", function () {
//   it("Should set the right unlockTime", async function () {
//     const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
//     expect(await lock.unlockTime()).to.equal(unlockTime);
//   });
//   it("Should set the right owner", async function () {
//     const { lock, owner } = await loadFixture(deployOneYearLockFixture);
//     expect(await lock.owner()).to.equal(owner.address);
//   });
//   it("Should receive and store the funds to lock", async function () {
//     const { lock, lockedAmount } = await loadFixture(
//       deployOneYearLockFixture
//     );
//     expect(await hre.ethers.provider.getBalance(lock.target)).to.equal(
//       lockedAmount
//     );
//   });
//   it("Should fail if the unlockTime is not in the future", async function () {
//     // We don't use the fixture here because we want a different deployment
//     const latestTime = await time.latest();
//     const Lock = await hre.ethers.getContractFactory("Lock");
//     await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
//       "Unlock time should be in the future"
//     );
//   });
// });
// describe("Withdrawals", function () {
//   describe("Validations", function () {
//     it("Should revert with the right error if called too soon", async function () {
//       const { lock } = await loadFixture(deployOneYearLockFixture);
//       await expect(lock.withdraw()).to.be.revertedWith(
//         "You can't withdraw yet"
//       );
//     });
//     it("Should revert with the right error if called from another account", async function () {
//       const { lock, unlockTime, otherAccount } = await loadFixture(
//         deployOneYearLockFixture
//       );
//       // We can increase the time in Hardhat Network
//       await time.increaseTo(unlockTime);
//       // We use lock.connect() to send a transaction from another account
//       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
//         "You aren't the owner"
//       );
//     });
//     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
//       const { lock, unlockTime } = await loadFixture(
//         deployOneYearLockFixture
//       );
//       // Transactions are sent using the first signer by default
//       await time.increaseTo(unlockTime);
//       await expect(lock.withdraw()).not.to.be.reverted;
//     });
//   });
//   describe("Events", function () {
//     it("Should emit an event on withdrawals", async function () {
//       const { lock, unlockTime, lockedAmount } = await loadFixture(
//         deployOneYearLockFixture
//       );
//       await time.increaseTo(unlockTime);
//       await expect(lock.withdraw())
//         .to.emit(lock, "Withdrawal")
//         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
//     });
//   });
//   describe("Transfers", function () {
//     it("Should transfer the funds to the owner", async function () {
//       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
//         deployOneYearLockFixture
//       );
//       await time.increaseTo(unlockTime);
//       await expect(lock.withdraw()).to.changeEtherBalances(
//         [owner, lock],
//         [lockedAmount, -lockedAmount]
//       );
//     });
//   });
// });
