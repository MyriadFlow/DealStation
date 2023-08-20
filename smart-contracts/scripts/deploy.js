const { ethers } = require("hardhat")

async function main() {
  let uri = "www.xyz.com"
  let saleprice = ethers.utils.parseEther("0.001")

  const TicketFactory = await ethers.getContractFactory("DealStationTicket")
  console.log("Deploying contract...")
  const ticket = await TicketFactory.deploy(uri, saleprice)
  await ticket.deployed()
  console.log("DealStationTicket deployed to:", ticket.address)

  if (network.name !== "hardhat") {
    // 6 blocks is sort of a guess
    await ticket.deployTransaction.wait(6)
    await verify(ticket.address, [uri, saleprice])
  }

  const AccountFactory = await ethers.getContractFactory("DealStationAccount")
  console.log("Deploying contract...")
  const account = await AccountFactory.deploy()
  await account.deployed()
  console.log("DealStationAccount deployed to:", account.address)

  if (network.name !== "hardhat") {
    // 6 blocks is sort of a guess
    await account.deployTransaction.wait(6)
    await verify(account.address, [])
  }

  const RegistryFactory = await ethers.getContractFactory("DealStationRegistry")
  console.log("Deploying contract...")
  const registry = await RegistryFactory.deploy(account.address, ticket.address)
  await registry.deployed()
  console.log("DealStationRegistry deployed to:", registry.address)

  if (network.name !== "hardhat") {
    // 6 blocks is sort of a guess
    await registry.deployTransaction.wait(6)
    await verify(registry.address, [account.address, ticket.address])
  }
}

// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
    Verified = true
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
