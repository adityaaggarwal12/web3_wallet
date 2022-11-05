const AdityaToken = artifacts.require('AdityaToken')

module.exports = async function (deployer) {
  await deployer.deploy(AdityaToken)

  const adityaToken = await AdityaToken.deployed()

  // Mint 200 NiceToken for the first account
  await adityaToken.mint('0x535Bc182F5e12d8Cd94fE8f9c39cee3462dFCe41', '200000000000000000000')
}