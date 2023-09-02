const { expect } = require("chai");

describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    // Retrieve the Hardhat Ethereum provider
    const { ethers } = hre;

    // Get the accounts from Hardhat's default wallet (usually [owner])
    const [owner] = await ethers.getSigners();

    // Deploy your contract
    const Token = await ethers.getContractFactory("Token");
    const hardhatToken = await Token.deploy();

    // Wait for the contract to be mined
    await hardhatToken.waitForDeployment();

    // Get the owner's balance
    const ownerBalance = await hardhatToken.balanceOf(owner.getAddress());

    // Check if the total supply matches the owner's balance
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});
