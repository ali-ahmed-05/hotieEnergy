// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");
const { json } = require("hardhat/internal/core/params/argumentTypes");

// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

let router_Address = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

async function main() {
 // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is avaialble in the global scope
  let nFT
  let Bytes
  let bytes
  const [deployer,per1,per2] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  BUSD = await ethers.getContractFactory("BUSD")  
  busd = await BUSD.deploy()
  await busd.deployed() 
  
  HESTOKEN = await ethers.getContractFactory("HESTOKEN")  
  hestoken = await HESTOKEN.deploy()
  await hestoken.deployed()

  Staking = await ethers.getContractFactory("Staking")  
  staking = await Staking.deploy()
  await staking.deployed()

  let _ETHvalue = await ethers.utils.parseEther('100')

  let _value = await ethers.utils.parseEther('10000000')

   await busd.setRouterAddress(router_Address, {value :_ETHvalue })  //  
   await busd.addLiquidity(_value, _ETHvalue )

  await hestoken.setRouterAddress(router_Address)

  await hestoken.excludeFromFee(staking.address)
  await hestoken.excludeFromReward(staking.address)


  await staking.setRouterAddress(router_Address)
  await staking.setHESTAddress(hestoken.address)

  _value = await ethers.utils.parseUnits('1000' , await hestoken.decimals())
  await hestoken.transfer(staking.address,_value)
  _value = await ethers.utils.parseUnits('1000' , await busd.decimals())
  await busd.transfer(staking.address,_value)


  await staking.addLiquidity(busd.address)

  await staking.setRewardTokenAddress(busd.address)
  
  console.log(staking.address)
  console.log(hestoken.address)
    
  saveFrontendFiles(staking , hestoken)
   

}

function saveFrontendFiles(nFT) {
  const fs = require("fs");
  const contractsDir = "../frontend/src/contract";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }
  let config = `
 export const staking_addr = "${nFT.address}"
 export const hestoken_addr = "${hestoken.address}"
 export const router_addr = "${router_Address}"
`

  let data = JSON.stringify(config)
  fs.writeFileSync(
    contractsDir + '/addresses.js', JSON.parse(data)

  );
  

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


// npx hardhat run scripts\deploy.js --network rinkeby