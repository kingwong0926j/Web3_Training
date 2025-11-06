//import ethers from "ethers"; --- IGNORE ---

const { ethers } = require("hardhat");

async function main() {
    const FundMe = await ethers.getContractFactory("FundMe");
    console.log("Deploying FundMe...");
    // FundMe constructor requires a lockTime (uint256). Use a reasonable default
    // e.g. 10 seconds
    const LOCK_TIME = 10;
    const fundMe = await FundMe.deploy(LOCK_TIME);
    await fundMe.waitForDeployment();
    console.log(`contract deployed to: ${fundMe.target}`);

    // Verify the contract after deployment
    if(hre.network.config.chainId == "11155111" && process.env.ETHERSCAN_API_KEY) {
        await fundMe.deploymentTransaction().wait(5); // 等待5个区块确认
        const contractAddress = fundMe.target;
        await verifyFuneMe(contractAddress, [LOCK_TIME]);
    }else {
        console.log("Skip verification: Not Sepolia network or missing ETHERSCAN_API_KEY"); 
    }
}
//init 2 account
const [firstAccount, secondAccount] = await ethers.getSigners();
console.log("First Account:", firstAccount.address);
console.log("Second Account:", secondAccount.address);
//fund conract with first account
const fundTx = await fundMe.connect(firstAccount).fund({value: ethers.parseEther("0.005")});
await fundTx.wait();
console.log(`Funded contract with 1 ETH from ${firstAccount.address}`);
//check contract balance
const contractBalance = await ethers.provider.getBalance(fundMe.target);
console.log(`Contract Balance: ${ethers.formatEther(contractBalance)} ETH`);
//fund contract with second account
const fundTx2 = await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.005")});
await fundTx2.wait();
console.log(`Funded contract with 2 ETH from ${secondAccount.address}`);
//check contract balance again
const updatedContractBalance = await ethers.provider.getBalance(fundMe.target);
console.log(`Updated Contract Balance: ${ethers.formatEther(updatedContractBalance)} ETH`);

//check mapping of address to amount funded
const firstAccountFunding = await fundMe.addressToAmountFunded(firstAccount.address);
console.log(`Amount funded by ${firstAccount.address}: ${ethers.formatEther(firstAccountFunding)} ETH`);
const secondAccountFunding = await fundMe.addressToAmountFunded(secondAccount.address);
console.log(`Amount funded by ${secondAccount.address}: ${ethers.formatEther(secondAccountFunding)} ETH`);

async function verifyFuneMe(fundMeAddress, args) {
    await hre.run("verify:verify", {
        address: fundMeAddress,
        constructorArguments: args,
        });
  }
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });