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

let router_Address = '0xD99D1c33F9fC3444f8101754aBC46c52416550D1'

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
  console.log("DONE 1")
  HESTOKEN = await ethers.getContractFactory("HESTOKEN")  
  hestoken = await HESTOKEN.deploy()
  await hestoken.deployed()
  console.log("DONE 2")
  Staking = await ethers.getContractFactory("Staking")  
  staking = await Staking.deploy(await deployer.getAddress(),await deployer.getAddress(),await deployer.getAddress())
  await staking.deployed()
  console.log("DONE3")
  let _ETHvalue = await ethers.utils.parseUnits('0.01',8)

  let _value = await ethers.utils.parseEther('10000000')

  let tx =  await busd.setRouterAddress(router_Address, {value :_ETHvalue })  //  
  await tx.wait()

   console.log("DONE 4")

  tx = await busd.addLiquidity(_value, _ETHvalue )
  await tx.wait()
  console.log("DONE 5")

  tx =await hestoken.setRouterAddress(router_Address)
  await tx.wait()
  console.log("DONE 6")

  tx =await hestoken.excludeFromFee(staking.address)
  await tx.wait()
  console.log("DONE 7")

  tx =await hestoken.excludeFromReward(staking.address)
  await tx.wait()
  console.log("DONE 8")



  tx =await staking.setRouterAddress(router_Address)
  await tx.wait()
  console.log("DONE 9")

  tx =await staking.setHESTAddress(hestoken.address)
  await tx.wait()
  console.log("DONE 10")

  _value = await ethers.utils.parseUnits('1000' , await hestoken.decimals())

  tx =await hestoken.transfer(staking.address,_value)
  await tx.wait()
  console.log("DONE 11")

  _value = await ethers.utils.parseUnits('1000' , await busd.decimals())

  tx =await busd.transfer(staking.address,_value)
  await tx.wait()
  console.log("DONE 12")


  tx =await staking.addLiquidity(busd.address)
  await tx.wait()
  console.log("DONE 13")

  tx =await staking.setRewardTokenAddress(busd.address)
  await tx.wait()
  console.log("DONE 14")
  
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