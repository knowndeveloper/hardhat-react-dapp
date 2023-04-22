// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;
  const lockedAmount = hre.ethers.utils.parseEther("0.001");

  const Lock = await hre.ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello! Greeter deployed.");

  const MyContract = await hre.ethers.getContractFactory("MyContract");
  const mycontract = await MyContract.deploy();

  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy();
  
  await lock.deployed();
  await greeter.deployed();
  await mycontract.deployed();
  await token.deployed();

  console.log(
    `Lock with ${ethers.utils.formatEther(lockedAmount)} ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  );

  console.log(
    `Greeter successfully deployed to ${greeter.address}`
  );

  console.log(
    `MyContract successfully deployed to ${mycontract.address}`
  );

  console.log(
    `Token successfully deployed to ${token.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});